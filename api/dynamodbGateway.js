const { DynamoDB, config } = require('aws-sdk');

config.update({region: 'eu-west-2'});
const database = new DynamoDB.DocumentClient({
  apiVersion: '2012-08-10',
});

module.exports.getRecipes = () => {
  var params = {
    TableName: process.env.DYNAMO_TABLE,
    KeyConditionExpression: 'Category = :hkey',
    ExpressionAttributeValues: {
      ':hkey': 'RECIPE',
    }
  };
  return new Promise((resolve, reject) => {
    database
      .query(params, function(err, data) {
        if (err) {
          console.log(`There was an error fetching the data`, err);
          return reject(err);
        }    
        return resolve(data.Items);
      }
    );
  });
}

module.exports.getRecipeByName = (name) => {
  const params = {
    TableName: process.env.DYNAMO_TABLE,
    Key: {
      'Name': name,
      'Category': 'RECIPE'
    },
  };

  return new Promise((resolve, reject) => {
    database
      .get(params, function(err, data) {
        if (err) {
          console.log(`There was an error fetching the data for ${params.Key.id}`, err);
          return reject(err);
        }    
        return resolve(data.Item);
      }
    );
  });
};

module.exports.addRecipe = (recipe) => {
  const params = {
    TableName: process.env.DYNAMO_TABLE,
    Item: {
      "Name" : recipe.Name,
      "Category" : 'RECIPE'
    }
  };
  if (recipe.Ingredients) { params.Item["Ingredients"] = recipe.Ingredients }
  if (recipe.Method) { params.Item["Method"] = recipe.Method }
  if (recipe.Cuisine) { params.Item["Cuisine"] = recipe.Cuisine }
  if (recipe.Servings) { params.Item["Servings"] = recipe.Servings }
  if (recipe.Type) { params.Item["Type"] = recipe.Type}
  if (recipe.Notes) { params.Item["Notes"] = recipe.Notes }

  console.log("Adding to db", params)
  return new Promise((resolve, reject) => {
    database
      .put(params, function(err) {
        if (err) {
          console.log(`There was an error writing the recipe to the db`, err);
          return reject(err);
        }
        console.log("Recipes successfully added")
        return resolve(recipe);
      }
    );
  });
}