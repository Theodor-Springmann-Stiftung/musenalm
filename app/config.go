package app

import (
	"encoding/json"
	"fmt"
	"github.com/Theodor-Springmann-Stiftung/musenalm/helpers"
	"github.com/kelseyhightower/envconfig"
	"log/slog"
	"os"
)

// WARNING: this is not intended to be used in a multi-threaded environment
// Instatiate this once on startup before any goroutines are started
const (
	DEFAULT_PORT  = "8080"
	DEFAULT_ADDR  = "localhost"
	DEFAULT_HTTPS = false

	ENV_PREFIX = "MUSENALM"
)

type ConfigProvider struct {
	Files    []string
	DevFiles []string
	*Config
}

type Config struct {
	// At least one of these should be set
	Debug          bool `json:"debug,omitempty" envconfig:"DEBUG"`
	AllowTestLogin bool `json:"allow_test_login,omitempty" envconfig:"ALLOW_TEST_LOGIN"`
}

func NewConfigProvider(files []string, devfiles []string) *ConfigProvider {
	return &ConfigProvider{Files: files, DevFiles: devfiles}
}

func (c *ConfigProvider) Read() error {
	c.Config = &Config{}

	for _, file := range c.Files {
		conf, err := readSettingsFile(file)
		if err == nil {
			c.Config = conf
		} else {
			panic(err)
		}
	}

	for _, file := range c.DevFiles {
		conf, err := readSettingsFile(file)
		if c.Debug {
			if err == nil {
				c.Config = conf
			} else {
				panic(err)
			}
		}
	}
	c.Config = readSettingsEnv(c.Config)
	c.Config = readDefaults(c.Config)
	return nil
}

func (c *ConfigProvider) Validate() error {
	return nil
}

func readSettingsFile(path string) (*Config, error) {
	cfg := &Config{}
	f, err := os.Open(path)
	if err != nil {
		slog.Error("Error opening config file ", "path", path, "error", err)
		return cfg, err
	}
	defer f.Close()

	dec := json.NewDecoder(f)
	err = dec.Decode(cfg)
	helpers.Assert(err, "Error decoding config file")

	return cfg, nil
}

func readSettingsEnv(cfg *Config) *Config {
	_ = envconfig.Process(ENV_PREFIX, cfg)
	return cfg
}

func readDefaults(cfg *Config) *Config {
	return cfg
}

// Implement stringer
func (c *Config) String() string {
	json, err := json.MarshalIndent(c, "", "  ")
	if err != nil {
		return fmt.Sprintf("Error marshalling config: %v", err)
	}
	return string(json)
}
