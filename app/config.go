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
	DEFAULT_GIT_DIR = "data_git"
	DEFAULT_GND_DIR = "cache_gnd"
	DEFAULT_GEO_DIR = "cache_geo"
	DEFAULT_IMG_DIR = "data_bilder"

	DEFAULT_PORT  = "8080"
	DEFAULT_ADDR  = "localhost"
	DEFAULT_HTTPS = false

	ENV_PREFIX = "KGPZ"
)

type ConfigProvider struct {
	Files []string
	*Config
}

type Config struct {
	// At least one of these should be set
}

func NewConfigProvider(files []string) *ConfigProvider {
	return &ConfigProvider{Files: files}
}

func (c *ConfigProvider) Read() error {
	c.Config = &Config{}
	for _, file := range c.Files {
		c.Config = readSettingsFile(c.Config, file)
	}
	c.Config = readSettingsEnv(c.Config)
	c.Config = readDefaults(c.Config)
	return nil
}

func (c *ConfigProvider) Validate() error {
	return nil
}

func readSettingsFile(cfg *Config, path string) *Config {
	f, err := os.Open(path)
	if err != nil {
		slog.Error("Error opening config file ", "path", path, "error", err)
		return cfg
	}
	defer f.Close()

	dec := json.NewDecoder(f)
	err = dec.Decode(cfg)
	helpers.Assert(err, "Error decoding config file")

	return cfg
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
