module.exports.schema = 
  `
    type Query {
      recipes: [Recipe]
      recipe(name: String): Recipe
    }
    type Mutation {
      addRecipe(recipe: Recipe)
    }
    type Recipe {
      name: String
      cuisine: String
      servings: String
      ingredients: [Ingredient]
      method: [String]
    }
    type Ingredient {
      name: String
      measurement: String
      amount: Float
    }
`
