module.exports.schema = 
  `
    type Query {
      recipes: [Recipe]
      recipe(name: String): Recipe
    }
    type Recipe {
      name: String
      cuisine: String
      ingredients: [Ingredient]
      method: [String]
    }
    type Ingredient {
      name: String
      measurement: String
      amount: Float
    }
`
