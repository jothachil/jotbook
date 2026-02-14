const { FusesPlugin } = require("@electron-forge/plugin-fuses");
const { FuseV1Options, FuseVersion } = require("@electron/fuses");
const path = require("node:path");
const fs = require("node:fs");

/**
 * Recursively copy a directory.
 * Required because the Vite plugin doesn't include node_modules in the
 * staging directory, so externalized native modules must be copied manually.
 */
function copyDirSync(src, dest) {
	if (!fs.existsSync(src)) return;
	fs.mkdirSync(dest, { recursive: true });
	for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
		const s = path.join(src, entry.name);
		const d = path.join(dest, entry.name);
		entry.isDirectory() ? copyDirSync(s, d) : fs.copyFileSync(s, d);
	}
}

/**
 * Collect a module and all of its production dependencies (recursively).
 */
function collectDeps(moduleName, nodeModulesDir, collected = new Set()) {
	if (collected.has(moduleName)) return collected;
	collected.add(moduleName);
	try {
		const pkgPath = path.join(nodeModulesDir, moduleName, "package.json");
		const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
		for (const dep of Object.keys(pkg.dependencies || {})) {
			collectDeps(dep, nodeModulesDir, collected);
		}
	} catch {
		// Module may not have a package.json — skip
	}
	return collected;
}

module.exports = {
	packagerConfig: {
		icon: "./images/icon",
		asar: {
			unpack: "**/node_modules/{better-sqlite3,bindings,file-uri-to-path}/**",
		},
	},
	rebuildConfig: {},
	hooks: {
		preMake: async () => {
			// Delete the database so the packaged app starts fresh
			const userDataPath = path.join(
				process.env.HOME,
				"Library",
				"Application Support",
				"jotbook",
				"notes.db",
			);
			if (fs.existsSync(userDataPath)) {
				fs.unlinkSync(userDataPath);
				console.log("Deleted notes.db from userData");
			}
		},
		packageAfterCopy: async (_config, buildPath) => {
			const projectNodeModules = path.join(__dirname, "node_modules");
			const deps = collectDeps("better-sqlite3", projectNodeModules);
			for (const dep of deps) {
				copyDirSync(
					path.join(projectNodeModules, dep),
					path.join(buildPath, "node_modules", dep),
				);
			}
		},
	},
	makers: [
		{
			name: "@electron-forge/maker-dmg",
			config: {
				format: "ULFO",
				icon: "./images/icon.icns",
			},
		},
	],
	plugins: [
		{
			name: "@electron-forge/plugin-vite",
			config: {
				build: [
					{
						entry: "src/main.js",
						config: "vite.main.config.mjs",
						target: "main",
					},
					{
						entry: "src/preload.js",
						config: "vite.preload.config.mjs",
						target: "preload",
					},
				],
				renderer: [
					{
						name: "main_window",
						config: "vite.renderer.config.mjs",
					},
				],
			},
		},
		// Fuses are used to enable/disable various Electron functionality
		// at package time, before code signing the application
		new FusesPlugin({
			version: FuseVersion.V1,
			[FuseV1Options.RunAsNode]: false,
			[FuseV1Options.EnableCookieEncryption]: true,
			[FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
			[FuseV1Options.EnableNodeCliInspectArguments]: false,
			[FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: false,
			[FuseV1Options.OnlyLoadAppFromAsar]: false,
		}),
	],
};
