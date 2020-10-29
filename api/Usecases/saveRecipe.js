const { addRecipe } = require("./../Gateways/recipesGateway")
const { savePicture } = require("./../Gateways/picturesGateway")

module.exports.execute = (input) => {
  const recipeToDbEntity = (recipe) => ({
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

  return savePicture(input.name, input.picture).then(name => addRecipe(recipeToDbEntity(input)));
}