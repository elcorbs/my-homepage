const { getRecipeByName, getRecipes, addRecipe } = require("./dynamodbGateway");

const dbToGraphQL = (recipe) => ({
  name: recipe.Name,
  cuisine: recipe.Cuisine,
  method: recipe.Method,
  servings: recipe.Servings,
  type: recipe.Type,
  notes: recipe.Notes,
  ingredients: recipe.Ingredients ? recipe.Ingredients.map(i => ({
    name: i.Name,
    amount: i.Amount,
    measurement: i.Measurement
  })) : undefined
});

const graphQlToDb = (recipe) => ({
    Name: recipe.name,
    Cuisine: recipe.cuisine,
    Method: recipe.method,
    Servings: recipe.servings,
    Type: recipe.type,
    Notes: recipe.notes,
    Ingredients: recipe.ingredients ? recipe.ingredients.map(i => ({
      Name: i.name,
      Amount: i.amount,
      Measurement: i.measurement
    })) : undefined 
})

module.exports.resolvers = {
    recipe: ({ name }) => getRecipeByName(name).then(data => dbToGraphQL(data)),
    recipes: () => getRecipes().then(data => data.map(recipe => dbToGraphQL(recipe))),
    addRecipe: ({ input }) => addRecipe(graphQlToDb(input)).then(data => dbToGraphQL(data))
}
