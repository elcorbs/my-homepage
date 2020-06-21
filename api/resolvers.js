const { getRecipeByName, getRecipes, addRecipe } = require("./dynamodbGateway");

const dbToGrapQL = (recipe) => ({
  name: recipe.Name,
  cuisine: recipe.Cuisine,
  method: recipe.Method,
  servings: recipe.Servings,
  ingredients: recipe.Ingredients.map(i => ({
    name: i.Name,
    amount: i.Amount,
    measurement: i.Measurement
  }))
});

const graphQlToDb = (recipe) => ({
  Name: recipe.name,
  Cuisine: recipe.cuisine,
  Method: recipe.method,
  Ingredients: recipe.ingredients.map(i => ({
    Name: i.name,
    Amount: i.amount,
    Measurement: i.measurement
  })) 
});

module.exports.resolvers = {
  Query: {
    recipe: (_, { name }) => getRecipeByName(name).then(data => dbToGrapQL(data)),
    recipes: (_) => getRecipes().then(data => data.map(recipe => dbToGrapQL(recipe)))
  },
  Mutation: {
    addRecipe: (_, { recipe }) => addRecipe(graphQlToDb(recipe).then(data => dbToGrapQL(data)))
  }
}