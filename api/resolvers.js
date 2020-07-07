const { getRecipeByName, getRecipes, addRecipe, getStoredValues, deleteRecipe, toggleValue } = require("./dynamodbGateway");

const dbToGraphQL = (recipe) => ({
  name: recipe.Name,
  cuisine: recipe.Cuisine,
  method: recipe.Method ? recipe.Method : [],
  servings: recipe.Servings,
  type: recipe.Type,
  notes: recipe.Notes,
  recipeLink: recipe.RecipeLink,
  wantToTry: recipe.WantToTry,
  pinned: recipe.Pinned,
  ingredients: recipe.Ingredients ? recipe.Ingredients.map(i => ({
    name: i.Name,
    amount: i.Amount,
    measurement: i.Measurement
  })) : []
});

const graphQlToDb = (recipe) => ({
  Name: recipe.name,
  Cuisine: recipe.cuisine,
  Method: recipe.method,
  Servings: recipe.servings,
  Type: recipe.type,
  Notes: recipe.notes,
  RecipeLink: recipe.recipeLink,
  WantToTry: recipe.wantToTry,
  Pinned: recipe.pinned,
  Ingredients: recipe.ingredients ? recipe.ingredients.map(i => ({
    Name: i.name,
    Amount: i.amount,
    Measurement: i.measurement
  })) : undefined 
})

module.exports.resolvers = {
    recipe: ({ name }) => getRecipeByName(name).then(data => dbToGraphQL(data)),
    recipes: () => getRecipes().then(data => data.map(recipe => dbToGraphQL(recipe))),
    addRecipe: ({ input }) => addRecipe(graphQlToDb(input)).then(data => dbToGraphQL(data)),
    repeatableValues: () => getStoredValues().then(data => data),
    removeRecipe: ({ name }) => deleteRecipe(name).then(data => data),
    toggleWantToTry: ({name, flag}) => toggleValue(name, "WantToTry", flag).then(data => data),
    toggleEatingNext: ({name, flag}) => toggleValue(name, "Pinned", flag).then(data => data)
}
