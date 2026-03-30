import { readdirSync, cpSync, writeFileSync, mkdirSync } from "fs";
import { join, extname } from "path";

const EXTENSIONS = new Set([".json", ".js", ".lock"]);
const EXCLUDE_DIRS = new Set(["node_modules"]);

function copyFiltered(src: string, dest: string): void {
  for (const entry of readdirSync(src, { withFileTypes: true })) {
    const srcPath = join(src, entry.name);
    const destPath = join(dest, entry.name);
    if (entry.isDirectory()) {
      if (!EXCLUDE_DIRS.has(entry.name)) copyFiltered(srcPath, destPath);
    } else if (EXTENSIONS.has(extname(entry.name))) {
      cpSync(srcPath, destPath, { recursive: true });
      console.log(`${srcPath} -> ${destPath}`);
    }
  }
}

// Copy filtered src files
copyFiltered("src", "dist");

// Copy config files
mkdirSync("dist", { recursive: true });
cpSync("hubspot.config.yml", join("dist", "hubspot.config.yml"));
console.log("hubspot.config.yml -> dist/hubspot.config.yml");

const hsproject = { name: "tosoh", srcDir: ".", platformVersion: "2025.1" };
writeFileSync(join("dist", "hsproject.json"), JSON.stringify(hsproject));
console.log("wrote dist/hsproject.json");
