const { getRecipeForId, getRecipes } = require("./dynamodbGateway");

const dbToGrapQL = (recipe) => ({
  id: recipe.id,
  name: recipe.Name,
  cuisine: recipe.Cuisine,
  method: recipe.Method,
  ingredients: recipe.Ingredients.map(i => ({
    name: i.Name,
    amount: i.Amount,
    measurement: i.Measurement
  }))
});

module.exports.resolvers = {
  Query: {
    recipe: (_, {id}) => getRecipeForId(id).then(data => dbToGrapQL(data)),
    recipes: (_) => getRecipes().then(data => data.map(recipe => dbToGrapQL(recipe)))
  }
}