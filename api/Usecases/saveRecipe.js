const { addRecipe } = require("../gateways/recipesGateway")

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
    PictureUrl: recipe.pictureUrl,
    Ingredients: recipe.ingredients ? recipe.ingredients.map(i => ({
      Name: i.name,
      Amount: i.amount,
      Measurement: i.measurement,
      Optional: i.optional
    })) : undefined
  });

  console.log("resolved saving picture")
  return addRecipe(recipeToDbEntity(input))
}