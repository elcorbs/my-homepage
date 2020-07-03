module.exports.schema = 
  `
    type Query {
      recipes: [Recipe]
      recipe(name: String): Recipe
      repeatableValues: ListTypes
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
      Dessert
      Bread
      Dip
    }
    type ListTypes {
      ingredients: [String]
      measures: [String]
      cuisines: [String]
    }
    type Recipe {
      name: String
      cuisine: String
      servings: Int
      ingredients: [Ingredient]
      method: [String]
      type: MealType
      notes: String
      recipeLink: String
    }
    type Ingredient {
      name: String
      measurement: String
      amount: Float
    }
    input RecipeInput {
      name: String!
      cuisine: String
      servings: Int
      ingredients: [IngredientInput]
      method: [String]
      type: MealType
      notes: String
      recipeLink: String
    }
    input IngredientInput {
      name: String
      measurement: String
      amount: Float
    }
`
