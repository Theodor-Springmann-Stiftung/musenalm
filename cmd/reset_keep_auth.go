package cmd

import (
	"database/sql"
	"errors"
	"fmt"
	"os"
	"path/filepath"
	"strings"

	maapp "github.com/Theodor-Springmann-Stiftung/musenalm/app"
	"github.com/spf13/cobra"
)

const resetKeepAuthCommandName = "reset-keep-auth"

var runPostResetSetup = func(app *maapp.App) error {
	if err := app.PB.RunAppMigrations(); err != nil {
		return fmt.Errorf("run app migrations: %w", err)
	}
	if err := app.PB.ReloadCachedCollections(); err != nil {
		return fmt.Errorf("reload cached collections after migrations: %w", err)
	}
	return nil
}

type preservedTable struct {
	Name    string
	Columns []string
	Rows    [][]any
}

type preservedAuthData struct {
	Users      preservedTable
	Superusers preservedTable
}

func RegisterResetKeepAuthCommand(app *maapp.App) {
	app.PB.RootCmd.AddCommand(newResetKeepAuthCommand(app))
}

func newResetKeepAuthCommand(app *maapp.App) *cobra.Command {
	return &cobra.Command{
		Use:                resetKeepAuthCommandName,
		Short:              "Reset the active PocketBase data dir while preserving users and superusers",
		SilenceUsage:       true,
		DisableFlagParsing: true,
		RunE: func(command *cobra.Command, args []string) error {
			result, err := resetKeepAuthData(app)
			if err != nil {
				return err
			}

			fmt.Fprintf(
				command.OutOrStdout(),
				"Preserved %d users and %d superusers in %s. Reset completed; start serve separately.\n",
				len(result.Users.Rows),
				len(result.Superusers.Rows),
				app.PB.DataDir(),
			)

			return nil
		},
	}
}

func resetKeepAuthData(app *maapp.App) (*preservedAuthData, error) {
	dataDir, err := validateSafeDataDir(app.PB.DataDir())
	if err != nil {
		return nil, err
	}

	dataDBPath := filepath.Join(dataDir, "data.db")
	preserved, err := exportPreservedAuthData(dataDBPath)
	if err != nil {
		return nil, err
	}

	if err := app.PB.ResetBootstrapState(); err != nil {
		return nil, fmt.Errorf("reset bootstrap state before data wipe: %w", err)
	}

	if err := os.RemoveAll(dataDir); err != nil {
		return nil, fmt.Errorf("remove data dir %q: %w", dataDir, err)
	}
	if err := os.MkdirAll(dataDir, os.ModePerm); err != nil {
		return nil, fmt.Errorf("recreate data dir %q: %w", dataDir, err)
	}

	if err := app.PB.Bootstrap(); err != nil {
		return nil, fmt.Errorf("bootstrap fresh data dir: %w", err)
	}
	if err := runPostResetSetup(app); err != nil {
		return nil, err
	}

	if err := restorePreservedAuthData(filepath.Join(dataDir, "data.db"), preserved); err != nil {
		return nil, err
	}
	if err := app.PB.ReloadCachedCollections(); err != nil {
		return nil, fmt.Errorf("reload cached collections after auth restore: %w", err)
	}

	return preserved, nil
}

func validateSafeDataDir(dir string) (string, error) {
	if strings.TrimSpace(dir) == "" {
		return "", errors.New("refusing to reset an empty data dir path")
	}

	abs, err := filepath.Abs(dir)
	if err != nil {
		return "", fmt.Errorf("resolve data dir %q: %w", dir, err)
	}

	cleaned := filepath.Clean(abs)
	if cleaned == string(os.PathSeparator) {
		return "", fmt.Errorf("refusing to reset unsafe data dir %q", cleaned)
	}

	return cleaned, nil
}

func exportPreservedAuthData(dataDBPath string) (*preservedAuthData, error) {
	db, err := sql.Open("pb_sqlite3", dataDBPath)
	if err != nil {
		return nil, fmt.Errorf("open source data db %q: %w", dataDBPath, err)
	}
	defer db.Close()

	users, err := dumpTable(db, "users")
	if err != nil {
		return nil, err
	}
	superusers, err := dumpTable(db, "_superusers")
	if err != nil {
		return nil, err
	}

	return &preservedAuthData{
		Users:      users,
		Superusers: superusers,
	}, nil
}

func dumpTable(db *sql.DB, table string) (preservedTable, error) {
	query := fmt.Sprintf(`SELECT * FROM %s`, quoteIdentifier(table))
	rows, err := db.Query(query)
	if err != nil {
		return preservedTable{}, fmt.Errorf("query %s: %w", table, err)
	}
	defer rows.Close()

	columns, err := rows.Columns()
	if err != nil {
		return preservedTable{}, fmt.Errorf("list columns for %s: %w", table, err)
	}

	result := preservedTable{Name: table, Columns: columns}

	for rows.Next() {
		row, err := scanRow(rows, len(columns))
		if err != nil {
			return preservedTable{}, fmt.Errorf("scan row from %s: %w", table, err)
		}
		result.Rows = append(result.Rows, row)
	}

	if err := rows.Err(); err != nil {
		return preservedTable{}, fmt.Errorf("iterate rows from %s: %w", table, err)
	}

	return result, nil
}

func scanRow(rows *sql.Rows, columnCount int) ([]any, error) {
	values := make([]any, columnCount)
	dests := make([]any, columnCount)
	for i := range values {
		dests[i] = &values[i]
	}

	if err := rows.Scan(dests...); err != nil {
		return nil, err
	}

	for i, value := range values {
		if bytes, ok := value.([]byte); ok {
			values[i] = string(bytes)
		}
	}

	return values, nil
}

func restorePreservedAuthData(dataDBPath string, preserved *preservedAuthData) error {
	db, err := sql.Open("pb_sqlite3", dataDBPath)
	if err != nil {
		return fmt.Errorf("open destination data db %q: %w", dataDBPath, err)
	}
	defer db.Close()

	tx, err := db.Begin()
	if err != nil {
		return fmt.Errorf("begin auth restore transaction: %w", err)
	}
	defer tx.Rollback()

	for _, table := range []preservedTable{preserved.Users, preserved.Superusers} {
		if _, err := tx.Exec(fmt.Sprintf(`DELETE FROM %s`, quoteIdentifier(table.Name))); err != nil {
			return fmt.Errorf("clear destination %s: %w", table.Name, err)
		}
		if err := insertTableRows(tx, table); err != nil {
			return err
		}
	}

	if err := tx.Commit(); err != nil {
		return fmt.Errorf("commit auth restore transaction: %w", err)
	}

	return nil
}

func insertTableRows(tx *sql.Tx, table preservedTable) error {
	if len(table.Columns) == 0 || len(table.Rows) == 0 {
		return nil
	}

	columnList := make([]string, len(table.Columns))
	placeholders := make([]string, len(table.Columns))
	for i, column := range table.Columns {
		columnList[i] = quoteIdentifier(column)
		placeholders[i] = "?"
	}

	query := fmt.Sprintf(
		`INSERT INTO %s (%s) VALUES (%s)`,
		quoteIdentifier(table.Name),
		strings.Join(columnList, ", "),
		strings.Join(placeholders, ", "),
	)

	stmt, err := tx.Prepare(query)
	if err != nil {
		return fmt.Errorf("prepare insert for %s: %w", table.Name, err)
	}
	defer stmt.Close()

	for _, row := range table.Rows {
		if _, err := stmt.Exec(row...); err != nil {
			return fmt.Errorf("insert preserved row into %s: %w", table.Name, err)
		}
	}

	return nil
}

func quoteIdentifier(name string) string {
	return `"` + strings.ReplaceAll(name, `"`, `""`) + `"`
}
