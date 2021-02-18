const {
  getRecipeByName,
  getRecipes,
  getStoredValues,
  deleteRecipe,
  toggleValue,
} = require("../gateways/recipesGateway");
const {
  getNotes,
  updateNotes,
  getNote,
  deleteNote
} = require("../gateways/notesGateway");
const saveRecipe = require("../usecases/saveRecipe");
const { login, signup, authenticateUser } = require("../usecases/authentication");
const { pictureUploadUrl, pictureDownloadUrl } = require("../gateways/picturesGateway");

const recipeToResponse = (recipe) => ({
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

const noteToResponse = (note) => ({
  title: note.Name,
  text: note.Data
});

module.exports.resolvers = {
  recipe: ({ name }) => getRecipeByName(name).then(data => recipeToResponse(data)),
  recipes: () => getRecipes().then(data => data.map(recipe => recipeToResponse(recipe))),
  addRecipe: (args, context) => authenticateUser(context, args, ({ input }) => saveRecipe.execute(input)).then(data => recipeToResponse(data)),
  repeatableValues: () => getStoredValues().then(data => data),
  removeRecipe: (args, context) => authenticateUser(context, args, ({ name }) => deleteRecipe(name)).then(data => data),
  toggleWantToTry: ({ name, flag }) => toggleValue(name, "WantToTry", flag).then(data => data),
  toggleEatingNext: ({ name, flag }) => toggleValue(name, "Pinned", flag).then(data => data),
  login: ({ username, password }) => login(username, password).then(data => data),
  signup: ({ username, password }) => signup(username, password).then(data => data),
  notes: () => getNotes().then(data => data.map(note => noteToResponse(note))),
  note: ({ title }) => getNote(title).then(data => noteToResponse(data)),
  saveNote: (args, context) => authenticateUser(context, args, ({ title, notes }) => updateNotes(title, notes)).then(data => data),
  removeNote: (args, context) => authenticateUser(context, args, ({ title }) => deleteNote(title)).then(data => data),
  pictureUploadUrl: (args, context) => authenticateUser(context, args, ({recipeName, fileType}) => pictureUploadUrl(recipeName, fileType)).then(url => url),
  pictureDownloadUrl: ({recipeName}) => pictureDownloadUrl(recipeName).then(url => url)
}
