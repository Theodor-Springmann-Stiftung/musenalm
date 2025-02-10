package cmd

import (
	"github.com/Theodor-Springmann-Stiftung/musenalm/app"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/core"
	"github.com/spf13/cobra"
)

func AddResetPagesCommand(pb *pocketbase.PocketBase, app *app.App) *cobra.Command {
	var resetPagesCmd = &cobra.Command{
		Use:   "resetpages",
		Short: "Reset all pages",
		Run: func(cmd *cobra.Command, args []string) {
			pb.OnBootstrap().BindFunc(func(e *core.BootstrapEvent) error {
				e.Next()
				if err := app.ResetPages(); err != nil {
					panic(err)
				}
				return nil
			})
		},
	}

	return resetPagesCmd
}
