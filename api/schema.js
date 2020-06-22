module.exports.schema = 
  `
    type Query {
      recipes: [Recipe]
      recipe(name: String): Recipe
    }
    type Mutation {
      addRecipe(input: RecipeInput): Recipe
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
    input RecipeInput {
      name: String!
      cuisine: String
      servings: String
      ingredients: [IngredientInput]
      method: [String]
    }
    input IngredientInput {
      name: String
      measurement: String
      amount: Float
    }
`
