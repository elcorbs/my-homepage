const {
  graphql,
  buildSchema,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLList,
  GraphQLEnumType,
  GraphQLScalarType
} = require('graphql')

const ingredientType = new GraphQLObjectType({
  name: 'Ingredient',
  fields: {
    name: { type: GraphQLString },
    amount: { type: GraphQLString }
  }
});

const recipe = new GraphQLObjectType({
  name: 'Recipe',
  fields: {
    id: { type: GraphQLString},
    name: { type: GraphQLString },
    subCategory: { type: GraphQLString },
    ingredients: { 
      type: new GraphQLList(ingredientType)
    },
    method: {
      type: new GraphQLList(GraphQLString)
    }
  }
})

const query = new GraphQLObjectType({
  name: 'Query',
  fields: {
    recipes: {
      args: { 
        id: { name: 'id', type: GraphQLString },
        cuisine: { name: 'Cuisine', type: GraphQLString }
      },
      type: new GraphQLList(recipe),
      resolve: (parent, args) => getRecipes(args.id, args.cuisine)
    }
  }
});

const fakeGetRecipe = (id, cuisine) => {
  recipes = [
    {
      id: '1',
      name: 'babganoush',
      subCategory: 'mezze',
      ingredients: [{name: 'Aubegines', amount: '4'}],
      method: ["Heat aubergines really hot", 'Mix with other ingredients']
    },
    {
      id: '2',
      name: 'pizza',
      subCategory: 'italian',
      ingredients: [{name: 'Flour', amount: '250g'}],
      method: ["Mix flour with water and oil", "Add toppings", "Heat in oven"]
    }
  ];
  if (id) return [recipes.find(r => r.id == id)];
  if (cuisine) return [recipes.find(r => r.subCategory == cuisine)]
}

const getRecipes = fakeGetRecipe;
const schema = new GraphQLSchema({
  query: query
})

module.exports.query = async (event) => {
  const result = await graphql(schema, event.queryStringParameters.query)

  return { statusCode: 200, body: JSON.stringify(result) }
}
