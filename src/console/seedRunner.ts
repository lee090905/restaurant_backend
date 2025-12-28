import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";
import { createRequire } from "module";

export async function runSeeders(): Promise<void> {
  const seedersDir = path.join(__dirname, "..", "database", "seeder");

  let files: string[];
  try {
    files = await fs.promises.readdir(seedersDir);
  } catch (err) {
    // If no seeder folder, nothing to do
    console.warn("No seeder directory found:", seedersDir);
    return;
  }

  const seederFiles = files.filter((f) => f.endsWith(".ts") || f.endsWith(".js")).sort();
  if (seederFiles.length === 0) {
    console.log("No seeder files found in", seedersDir);
    return;
  }

  for (const file of seederFiles) {
    const fullPath = path.join(seedersDir, file);
    const fileUrl = pathToFileURL(fullPath).href;
    console.log(`Running seeder: ${file}`);

    let mod: any;
    const requireFn = createRequire(__filename);
    try {
      if (file.endsWith(".ts")) {
        mod = requireFn(fullPath);
      } else {
        mod = await import(fileUrl);
      }
    } catch (firstErr) {
      try {
        mod = await import(fileUrl);
      } catch (err) {
        throw new Error(`Seeder failed (${file}): ${err || firstErr}`);
      }
    }

    const fn = (mod && (mod.default ?? mod));
    if (typeof fn === "function") {
      await fn();
      console.log(`Seeder succeeded: ${file}`);
    } else {
      console.warn(`Skipping ${file}: no exported function found`);
    }
  }

  console.log("All seeders finished.");
}

export default runSeeders;
