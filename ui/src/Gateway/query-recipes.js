import { getToken, isLoggedIn } from "../Utilities/helper-functions";

export async function getRecipes(callback) {
  const schema = `query {recipes{name, cuisine, wantToTry, type, pinned, ingredients{name, measurement}}}`;
  await queryApi(schema, data => callback(data.recipes))
}

export async function getRecipe(name, callback){
  const schema = `query {recipe(name: "${name}"){name, cuisine, type, recipeLink, wantToTry, pinned, servings, notes, ingredients{name, amount, measurement, optional}, method}}`;
  await queryApi(schema, data => callback(data.recipe))
}

export async function addRecipe(recipe, callback){
  const recipeStringLiteral = mapRecipeToQueryStringLiteral(recipe);
  const schema = `mutation {addRecipe(input: ${recipeStringLiteral} ){name, cuisine, ingredients{name, measurement}}}`;
  await queryApi(schema, data => callback(data.addRecipe))
}

export async function editRecipe(recipe, callback){
  const recipeStringLiteral = mapRecipeToQueryStringLiteral(recipe);
  const schema = `mutation {addRecipe(input: ${recipeStringLiteral} ){name, cuisine, type, recipeLink, servings, notes, ingredients{name, amount, measurement, optional}, method}}`;
  await queryApi(schema, data => callback(data.addRecipe))
}

export async function removeRecipe(name, callback){
  const schema = `mutation {removeRecipe(name: "${name}")}`;
  await queryApi(schema, callback)
}

export async function getStoredIngredients(callback){
  const schema = `query {repeatableValues { measures, ingredients, cuisines } }`;
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

export async function login(name, password, callback){
  const schema = `mutation {login(username: "${name}", password: "${password}"){ token, user{ name, admin }}}`
  await queryApi(schema, data => {
    if (data.login) localStorage.setItem('emmas-recipes-token', data.login.token)
    if (data.login) localStorage.setItem('emmas-recipes-username', data.login.user.name)
    if (data.login) localStorage.setItem('emmas-recipes-admin', data.login.user.admin)
    callback(data.login)
  })
}

function mapIngredientToStringLiteral(ingredient) {
  if(!ingredient.name && !ingredient.amount && !ingredient.measurement) return "";
  const name = ingredient.name ? `name: "${ingredient.name}"` : "";
  const amount = ingredient.amount ? `, amount: ${ingredient.amount}` : "";
  const measurement = ingredient.measurement ? `, measurement: "${ingredient.measurement}"` : "";
  return '{' + name + amount + measurement  + ', optional: '  + ingredient.optional + '}'; 
}

function mapRecipeToQueryStringLiteral(recipe){
  return `{
    name: "${recipe.name}",
    ${getKeyValue(recipe, "cuisine")}
    ${recipe.servings ? `servings: ${recipe.servings},` : ""}
    ${recipe.ingredients
      ? `ingredients: [${recipe.ingredients.map(i => mapIngredientToStringLiteral(i))}],`
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
  const apiUrl = process.env.REACT_APP_API_URL;

  let url = new URL(apiUrl);
  const request = {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
    },
    body: query
  }
  if(isLoggedIn()) request.headers['Authorization'] = `Bearer ${getToken()}`;

  const response = await fetch(url, request);
  const data = await response.json();

  callback(data.data);
}
