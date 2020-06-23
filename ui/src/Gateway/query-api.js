
export async function getRecipes(callback) {
  const schema = `query=query {recipes{name, cuisine, ingredients{name, measurement}}}`;
  await queryApi(schema, data => callback(data.recipes))
}

export async function getRecipe(name, callback){
  const schema = `query=query {recipe(name: "${name}"){name, cuisine, type, notes, ingredients{name, amount, measurement}, method}}`;
  await queryApi(schema, data => callback(data.recipe))
}

export async function addRecipe(recipe, callback){
  const recipeStringLiteral = `{
    name: "${recipe.name}",
    ${recipe.cuisine ? `cuisine:  "${recipe.cuisine}",` : "" }
    ${recipe.ingredients ? `ingredients: [${recipe.ingredients.map(i => 
      `{name: "${i.name}" ${i.amount ? `, amount: ${i.amount}` : ""} ${i.measurement ? `, measurement:"${i.measurement}"}` : "}"}`)}],` : "" }
    ${recipe.method ? `method: [${recipe.method.map(step => `"${step}"`)}],` : "" }
    ${recipe.notes ? `notes: "${recipe.notes},"` : ""}
    ${recipe.type ? `type: ${recipe.type},`: ""}
  }`
  const schema = `query=mutation {addRecipe(input: ${recipeStringLiteral} ){name, cuisine, ingredients{name, measurement}}}`;
  await queryApi(schema, data => callback(data.addRecipe), 'POST')
}

async function queryApi(query, callback, method = 'GET') {
  const apiUrl = "https://6lac5t2w1i.execute-api.eu-west-2.amazonaws.com/production/query"

  let url = new URL(apiUrl);
  url.search = encodeURI(query);
  const response = await fetch(url, {
    method,
    headers: {
      'Accept': 'application/json',
    },
  })
  const data = await response.json();

  callback(data.data);
}

