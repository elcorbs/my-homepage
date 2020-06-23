module.exports.schema = 
  `
    type Query {
      recipes: [Recipe]
      recipe(name: String): Recipe
    }
    type Mutation {
      addRecipe(input: RecipeInput): Recipe
    }
    enum MealType {
      Breakfast
      Lunch
      Dinner
      Side
      Salad
      SmallPlate
    }
    type Recipe {
      name: String
      cuisine: String
      servings: String
      ingredients: [Ingredient]
      method: [String]
      type: MealType
      notes: String
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
      type: MealType
      notes: String
    }
    input IngredientInput {
      name: String
      measurement: String
      amount: Float
    }
`
