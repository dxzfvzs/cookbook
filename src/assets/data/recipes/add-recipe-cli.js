import fs from "fs";
import path from "path";
import {categoriesByGroup} from "../categories.ts";
import {input, select} from '@inquirer/prompts';

const toFirstUppercase = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const createFilePath = (title) => {
  const jsonDir = path.resolve("./jsons");
  if (!fs.existsSync(jsonDir)) {
    fs.mkdirSync(jsonDir, {recursive: true});
  }

  const fileName = title.toLowerCase().replace(/\s+/g, "-") + ".json";
  return path.join(jsonDir, fileName);
}

const askTitle = async () => {
  return await input({message: "Recipe title:", required: true});
}

const askCategory = async (type, options) => {
  const choices = options.map(o => ({name: toFirstUppercase(o.id), value: o.id}));
  return await select({message: `Choose a ${type} category:`, choices: choices});
}

const askYesOrNo = async (question, value = true) => {
  let choices = [
    {name: "Yes", value: value},
    {name: "No", value: false}
  ]
  return await select({message: question, choices: choices});
}

const askMultiLine = async (type) => {
  const entries = [];

  console.log(`Enter ${type} (press Enter on empty line to finish):`);
  while (true) {
    const step = await input({message: "-"});
    if (!step) break;
    entries.push(step);
  }
  return entries;
}

const askSectionedMultilines = async (type) => {
  const entries = [];

  while (true) {
    const section = await input({message: "Enter the section name (press Enter on empty line to finish):"});
    if (!section) break;
    const items = await askMultiLine(`${type} for ${section}`);
    entries.push({section: section, items: items});
  }

  return entries;
}

const getRecipeFromCli = async () => {
  try {
    const title = await askTitle();

    console.log("");

    const categories = [
      await askCategory("outcome", categoriesByGroup.outcome),
      await askCategory("type", categoriesByGroup.type),
      await askCategory("diet", categoriesByGroup.diet)
    ]

    console.log("");

    const hasMoreIngredientSections = await askYesOrNo("Do you want sections for ingredients?");
    const ingredients = hasMoreIngredientSections
      ? await askSectionedMultilines("ingredients")
      : await askMultiLine("ingredients");

    console.log("");

    const hasMoreInstructionsSections = await askYesOrNo("Do you want sections for instructions?");
    const instructions = hasMoreInstructionsSections
      ? await askSectionedMultilines("instructions")
      : await askMultiLine("instructions");

    console.log("");

    return {title, categories, ingredients, instructions};
  } catch (error) {
    if (error.name === 'ExitPromptError') {
      console.error(`Exiting, no recipe will be written.`);
    } else {
      console.log(error.message);
    }
    return undefined;
  }
}

const writeRecipe = async (recipe) => {
  const filePath = createFilePath(recipe.title);

  try {
    fs.writeFileSync(filePath, JSON.stringify(recipe, null, 2), "utf8");
    console.log(`Recipe saved to ${filePath}`);
  } catch (err) {
    console.error("Could not save file, printing JSON instead:\n");
    console.log(JSON.stringify(recipe, null, 2));
  }
}

(async () => {
  const recipe = await getRecipeFromCli();
  if (!recipe) return -1;

  await writeRecipe(recipe);
})();
