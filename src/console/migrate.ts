import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";
import { createRequire } from "module";

async function runMigrations(): Promise<void> {
	const migrationsDir = path.join(__dirname, "..", "database", "migrations");

	let files: string[];
	try {
		files = await fs.promises.readdir(migrationsDir);
	} catch (err) {
		console.error("Failed to read migrations directory:", err);
		process.exit(1);
		return;
	}

	// Keep only .ts or .js files and sort to run them in order
	const migrationFiles = files
		.filter((f) => f.endsWith(".ts") || f.endsWith(".js"))
		.sort();

	if (migrationFiles.length === 0) {
		console.log("No migration files found in", migrationsDir);
		return;
	}

	for (const file of migrationFiles) {
		const fullPath = path.join(migrationsDir, file);
		const fileUrl = pathToFileURL(fullPath).href;
		console.log(`Running migration: ${file}`);

		// Use require when possible (ts-node registers require hooks), fall back to dynamic import
		let mod: any;
		const requireFn = createRequire(__filename);
		try {
			if (file.endsWith(".ts")) {
				// prefer require so ts-node's register handles .ts files
				mod = requireFn(fullPath);
			} else {
				// for .js files dynamic import is fine
				mod = await import(fileUrl);
			}
		} catch (firstErr) {
			// fallback to dynamic import if require failed
			try {
				mod = await import(fileUrl);
			} catch (err) {
				console.error(`Migration failed (${file}):`, err || firstErr);
				process.exit(1);
			}
		}

		const fn = (mod && (mod.default ?? mod));
		if (typeof fn === "function") {
			try {
				await fn();
				console.log(`Migration succeeded: ${file}`);
			} catch (err) {
				console.error(`Migration failed (${file}):`, err);
				process.exit(1);
			}
		} else {
			console.warn(`Skipping ${file}: no exported function found`);
		}
	}

	console.log("All migrations finished.");
}

runMigrations().catch((err) => {
	console.error("Migration runner failed:", err);
	process.exit(1);
});

