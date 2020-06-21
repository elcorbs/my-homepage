
export async function getRecipes(callback) {
  const schema = `query={recipes{id, name, cuisine, ingredients{name, amount, measurement}, method}}`;
  await queryApi(schema, data => callback(data.recipes))
}

export async function getRecipe(id, callback){
  const schema = `query={recipe(id: ${id}){id, name, cuisine, ingredients{name, amount, measurement}, method}}`;
  await queryApi(schema, data => callback(data.recipe))
}

async function queryApi(query, callback) {
  const apiUrl = "https://6lac5t2w1i.execute-api.eu-west-2.amazonaws.com/production/query"

  let url = new URL(apiUrl);
  url.search = encodeURI(query);
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
    query: query
  })
  const data = await response.json();

  callback(data.data);
}

