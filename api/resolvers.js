const {
  getRecipeByName,
  getRecipes,
  addRecipe,
  getStoredValues,
  deleteRecipe,
  toggleValue,
} = require("./recipesGateway");
const {
  getNotes,
  updateNotes
} = require("./notesGateway");
const { login, signup, authenticateUser } = require("./authentication");

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
    measurement: i.Measurement,
    optional: i.Optional || false
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
    Measurement: i.measurement,
    Optional: i.optional 
  })) : undefined
})

module.exports.resolvers = {
  recipe: ({ name }) => getRecipeByName(name).then(data => dbToGraphQL(data)),
  recipes: () => getRecipes().then(data => data.map(recipe => dbToGraphQL(recipe))),
  addRecipe: (args, context) => authenticateUser(context, args, ({ input }) => addRecipe(graphQlToDb(input))).then(data => dbToGraphQL(data)),
  repeatableValues: () => getStoredValues().then(data => data),
  removeRecipe: (args, context) =>  authenticateUser(context, args, ({name}) => deleteRecipe(name)).then(data => data),
  toggleWantToTry: ({ name, flag }) => toggleValue(name, "WantToTry", flag).then(data => data),
  toggleEatingNext: ({ name, flag }) => toggleValue(name, "Pinned", flag).then(data => data),
  login: ({ username, password }) => login(username, password).then(data => data),
  signup: ({ username, password }) => signup(username, password).then(data => data),
  notes: () => getNotes().then(data => data),
  saveNotes: ({notes}) => updateNotes(notes).then(data => data)
}
