
export async function getRecipes(callback) {
  const schema = `query {recipes{name, cuisine, ingredients{name, measurement}}}`;
  await queryApi(schema, data => callback(data.recipes))
}

export async function getRecipe(name, callback){
  const schema = `query {recipe(name: "${name}"){name, cuisine, type, recipeLink, servings, notes, ingredients{name, amount, measurement}, method}}`;
  await queryApi(schema, data => callback(data.recipe))
}

export async function addRecipe(recipe, callback){
  const recipeStringLiteral = mapRecipeToQueryStringLiteral(recipe);
  const schema = `mutation {addRecipe(input: ${recipeStringLiteral} ){name, cuisine, ingredients{name, measurement}}}`;
  await queryApi(schema, data => callback(data.addRecipe), 'POST')
}

export async function editRecipe(recipe, callback){
  const recipeStringLiteral = mapRecipeToQueryStringLiteral(recipe);
  const schema = `mutation {addRecipe(input: ${recipeStringLiteral} ){name, cuisine, type, recipeLink, servings, notes, ingredients{name, amount, measurement}, method}}`;
  await queryApi(schema, data => callback(data.addRecipe), 'POST')
}

export async function getStoredIngredients(callback){
  const schema = `query {repeatableValues { measures, ingredients } }`;
  await queryApi(schema, data => callback(data.repeatableValues))
}

function mapRecipeToQueryStringLiteral(recipe){
  return `{
    name: "${recipe.name}",
    ${recipe.cuisine ? `cuisine:  "${recipe.cuisine}",` : "" }
    ${recipe.servings ? `servings: ${recipe.servings},` : ""}
    ${recipe.ingredients
      ? `ingredients: [${recipe.ingredients.map(i => 
       `{name: "${i.name}"
        ${i.amount ? `, amount: ${i.amount}` : ""}
        ${i.measurement ? `, measurement:"${i.measurement}"}` : "}"}`)}],`
      : "" }
    ${recipe.method ? `method: [${recipe.method.map(step => `"${step}"`)}],` : "" }
    ${recipe.notes ? `notes: "${recipe.notes}",` : ""}
    ${recipe.recipeLink ? `recipeLink: "${recipe.recipeLink},"` : ""}
    ${recipe.type ? `type: ${recipe.type}`: ""}
  }`;
}

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

