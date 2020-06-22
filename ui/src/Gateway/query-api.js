
export async function getRecipes(callback) {
  const schema = `query=query {recipes{name, cuisine, ingredients{name, amount, measurement}, method}}`;
  await queryApi(schema, data => callback(data.recipes))
}

export async function getRecipe(name, callback){
  const schema = `query=query {recipe(name: "${name}"){name, cuisine, ingredients{name, amount, measurement}, method}}`;
  await queryApi(schema, data => callback(data.recipe))
}

export async function addRecipe(recipe, callback){
  const schema = `query=mutation {addRecipe(input: {name: "${recipe.name}"}){name}}`;
  await queryApi(schema, data => callback(data.recipe), 'POST')
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

