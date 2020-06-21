module.exports.schema = 
  `
    type Query {
      recipes: [Recipe]
      recipe(id: Int): Recipe
    }
    type Recipe {
      id: Int
      name: String
      subCategory: String
      ingredients: [Ingredient]
      method: [String]
    }
    type Ingredient {
      name: String
      measurement: String
      amount: Float
    }
`
