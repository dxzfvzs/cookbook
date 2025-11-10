import fs from "fs";
import path from "path";

const jsonDir = path.resolve("./jsons");

try {
    const files = fs.readdirSync(jsonDir).filter(f => f.endsWith(".json"));

    for (const file of files) {
        const filePath = path.join(jsonDir, file);
        const content = fs.readFileSync(filePath, "utf8");

        let data;
        try {
            data = JSON.parse(content);
        } catch {
            console.error(`❌ Skipping invalid JSON: ${file}`);
            continue;
        }

        const nameWithoutExt = file.replace(/\.json$/i, "");

        // only add/update if missing or mismatched
        if (data.fileName !== nameWithoutExt) {
            data.fileName = nameWithoutExt;
            fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
            console.log(`✅ Updated ${file}`);
        } else {
            console.log(`✔ Already has correct fileName: ${file}`);
        }
    }

    console.log("\nAll done!");
} catch (err) {
    console.error("Error:", err);
}
