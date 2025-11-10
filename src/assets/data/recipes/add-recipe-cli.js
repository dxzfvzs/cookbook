import fs from "fs";
import path from "path";
import readline from "readline";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const ask = (q) =>
    new Promise((resolve) => rl.question(q, (answer) => resolve(answer.trim())));

(async () => {
    try {
        const jsonDir = path.resolve("./jsons");
        if (!fs.existsSync(jsonDir)) {
            fs.mkdirSync(jsonDir, { recursive: true });
        }

        const title = await ask("Recipe title: ");
        if (!title) {
            console.log("No title entered. Exiting.");
            rl.close();
            return;
        }

        const fileName = title.toLowerCase().replace(/\s+/g, "-") + ".json";

        const ingredients = [];
        console.log("\nEnter ingredients (press Enter on empty line to finish):");
        while (true) {
            const item = await ask("> ");
            if (!item) break;
            ingredients.push(item);
        }

        const instructions = [];
        console.log("\nEnter instructions (press Enter on empty line to finish):");
        while (true) {
            const step = await ask("> ");
            if (!step) break;
            instructions.push(step);
        }

        const recipe = {
            title,
            fileName,
            ingredients,
            instructions,
        };

        const filePath = path.join(jsonDir, fileName);

        try {
            fs.writeFileSync(filePath, JSON.stringify(recipe, null, 2), "utf8");
            console.log(`\nRecipe saved to ${filePath}`);
        } catch (err) {
            console.error("\nCould not save file, printing JSON instead:\n");
            console.log(JSON.stringify(recipe, null, 2));
        }
    } catch (err) {
        console.error("Error:", err);
    } finally {
        rl.close();
    }
})();
