import { resolve } from "path";
import { defineConfig } from "vite";
export default defineConfig({
	mode: "production",
	define: {
		"process.env.NODE_ENV": '"production"',
	},
	build: {
		root: resolve(__dirname, ""),
		lib: {
			entry: "./transform/main.js",
			name: "PC-UI",
			fileName: "scripts",
			cssFileName: "style",
			formats: ["es"],
		},
		outDir: resolve(__dirname, "assets/"),
	},
});
