/**
 * Workaround for Turbopack's sandboxed module resolver not finding
 * the @tailwindcss/oxide native binding via the optional-dependency
 * package. This copies the platform-specific .node binary directly
 * into the oxide directory so the first require('./...') path
 * succeeds.
 *
 * Safe to remove once the upstream Turbopack issue is resolved.
 * See: https://github.com/npm/cli/issues/4828
 */

import { cpSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const platform = process.platform;
const arch = process.arch;

const platformMap = {
  "win32-x64": "tailwindcss-oxide.win32-x64-msvc.node",
  "linux-x64": "tailwindcss-oxide.linux-x64-gnu.node",
  "linux-arm64": "tailwindcss-oxide.linux-arm64-gnu.node",
  "darwin-x64": "tailwindcss-oxide.darwin-x64.node",
  "darwin-arm64": "tailwindcss-oxide.darwin-arm64.node",
};

const key = `${platform}-${arch}`;
const filename = platformMap[key];

if (!filename) {
  console.log(`[patch-tailwind-oxide] No mapping for ${key}, skipping.`);
  process.exit(0);
}

const oxideDir = join(root, "node_modules", "@tailwindcss", "oxide");
const dest = join(oxideDir, filename);

if (existsSync(dest)) {
  process.exit(0);
}

// Find the source from the platform-specific optional package
const candidates = [
  // npm / pnpm flat layout
  join(root, "node_modules", "@tailwindcss", `oxide-${key.replace("x64", "x64-msvc").replace("arm64", "arm64-gnu").replace("darwin-x64-msvc", "darwin-x64").replace("darwin-arm64-gnu", "darwin-arm64")}`, filename),
];

// Simpler: just glob from the @tailwindcss scope for any directory containing the filename
import { readdirSync } from "node:fs";
const scope = join(root, "node_modules", "@tailwindcss");
try {
  for (const entry of readdirSync(scope)) {
    const candidate = join(scope, entry, filename);
    if (existsSync(candidate)) {
      cpSync(candidate, dest);
      console.log(`[patch-tailwind-oxide] Copied ${filename} → oxide/`);
      process.exit(0);
    }
  }
} catch {
  // scope dir may not exist yet
}

console.log(`[patch-tailwind-oxide] Could not find ${filename}, skipping.`);
