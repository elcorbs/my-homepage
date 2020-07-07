
export async function getRecipes(callback) {
  const schema = `query {recipes{name, cuisine, wantToTry, pinned, ingredients{name, measurement}}}`;
  await queryApi(schema, data => callback(data.recipes))
}

export async function getRecipe(name, callback){
  const schema = `query {recipe(name: "${name}"){name, cuisine, type, recipeLink, wantToTry, pinned, servings, notes, ingredients{name, amount, measurement}, method}}`;
  await queryApi(schema, data => callback(data.recipe))
}

export async function addRecipe(recipe, callback){
  const recipeStringLiteral = mapRecipeToQueryStringLiteral(recipe);
  const schema = `mutation {addRecipe(input: ${recipeStringLiteral} ){name, cuisine}}`;
  await queryApi(schema, data => callback(data.addRecipe))
}

export async function editRecipe(recipe, callback){
  const recipeStringLiteral = mapRecipeToQueryStringLiteral(recipe);
  const schema = `mutation {addRecipe(input: ${recipeStringLiteral} ){name, cuisine, type, recipeLink, servings, notes, ingredients{name, amount, measurement}, method}}`;
  await queryApi(schema, data => callback(data.addRecipe))
}

export async function removeRecipe(name, callback){
  const schema = `mutation {removeRecipe(name: "${name}")}`;
  await queryApi(schema, callback)
}

export async function getStoredIngredients(callback){
  const schema = `query {repeatableValues { measures, ingredients } }`;
  await queryApi(schema, data => callback(data.repeatableValues))
}

export async function toggleWantToTry(name, value, callback){
  const schema = `mutation {toggleWantToTry(name: "${name}", flag: ${value})}`;
  await queryApi(schema, data => callback(data.toggleWantToTry, "wantToTry"));
}

export async function togglePinned(name, value, callback){
  const schema = `mutation {toggleEatingNext(name: "${name}", flag: ${value})}`;
  await queryApi(schema, data => callback(data.toggleEatingNext, "pinned"));
}

function mapRecipeToQueryStringLiteral(recipe){
  return `{
    name: "${recipe.name}",
    ${getKeyValue(recipe, "cuisine")}
    ${recipe.servings ? `servings: ${recipe.servings},` : ""}
    ${recipe.ingredients
      ? `ingredients: [${recipe.ingredients.map(i => 
       `{name: "${i.name}"
        ${i.amount ? `, amount: ${i.amount}` : ""}
        ${i.measurement ? `, measurement:"${i.measurement}"}` : "}"}`)}],`
      : "" }
    ${recipe.method ? `method: [${recipe.method.map(step => formatString(step))}],` : "" }
    ${getKeyValue(recipe, "notes")}
    ${getKeyValue(recipe, "recipeLink")}
    ${recipe.type ? `type: ${recipe.type}` : ""}
  }`;
}

const getKeyValue = (recipe, key) => recipe[key] ? `${key}:  ${formatString(recipe[key])},` : "";
const formatString = (text) => `"${text.replace(/(\r\n|\r|\n)/gm, "\\n")}"`;

async function queryApi(query, callback) {
  const apiUrl = "https://6lac5t2w1i.execute-api.eu-west-2.amazonaws.com/production/query"

  let url = new URL(apiUrl);
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
    },
    body: query
  })
  const data = await response.json();

  callback(data.data);
}
