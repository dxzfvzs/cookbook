import { existsSync } from "node:fs";
import { execSync } from "node:child_process";

// android/ is gitignored, so scaffold it fresh if missing, else just sync
const command = existsSync("android") ? "sync" : "add";

execSync(`npx cap ${command} android`, { stdio: "inherit" });
