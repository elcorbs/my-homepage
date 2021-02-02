module.exports.schema = 
  `
    type Query {
      recipes: [Recipe]
      recipe(name: String): Recipe
      repeatableValues: ListTypes
      notes: [Note]
      note(title: String): Note
      pictureUploadUrl(recipeName: String, fileType: String): String
    }
    type Mutation {
      addRecipe(input: RecipeInput): Recipe
      removeRecipe(name: String): String
      toggleWantToTry(name: String, flag: Boolean): Boolean
      toggleEatingNext(name: String, flag: Boolean): Boolean
      login(username: String!, password: String!): AuthPayload
      signup(username: String!, password: String!): AuthPayload
      saveNote(title: String, notes: String): String
      removeNote(title: String): String
    }
    type Note {
      title: String
      text: String
    }
    type AuthPayload {
      token: String
      user: User
    }
    type User {
      name: String!
      admin: Boolean
      email: String
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
      wantToTry: Boolean
      pinned: Boolean
    }
    type Ingredient {
      name: String
      measurement: String
      amount: Float
      optional: Boolean
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
      wantToTry: Boolean
      pinned: Boolean
    }
    input IngredientInput {
      name: String
      measurement: String
      amount: Float
      optional: Boolean
    }
`
