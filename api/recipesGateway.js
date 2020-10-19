const { DynamoDB, config } = require('aws-sdk');

config.update({ region: 'eu-west-2' });
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
      .query(params, function (err, data) {
        if (err) {
          console.log(`There was an error fetching the data`, err);
          return reject(err);
        }
        return resolve(data.Items);
      }
      );
  });
}

module.exports.getUser = (email) => {
  const params = {
    TableName: process.env.DYNAMO_TABLE,
    Key: {
      'Name': email,
      'Category': 'USER'
    }
  }

  console.log("contacting db")
  return new Promise((resolve, reject) => {
    database
      .get(params, function (err, data) {
        console.log("received data", data)
        console.log("received error", err)
        if (err) {
          console.log(`There was an error fetching the user from the database`, err);
          return reject(err);
        }
        if (!data.Item) return resolve(null);

        return resolve({name: data.Item.Name, password: data.Item.Password, adminAccess: data.Item.AdminAccess});
      })
  })
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
      .get(params, function (err, data) {
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
      "Name": recipe.Name,
      "Category": 'RECIPE'
    }
  };
  console.log("Trying to add recipe to the db", recipe)
  if (recipe.Ingredients) { params.Item["Ingredients"] = recipe.Ingredients }
  if (recipe.Method) { params.Item["Method"] = recipe.Method }
  if (recipe.Cuisine) { params.Item["Cuisine"] = recipe.Cuisine }
  if (recipe.Servings) { params.Item["Servings"] = recipe.Servings }
  if (recipe.Type) { params.Item["Type"] = recipe.Type }
  if (recipe.Notes) { params.Item["Notes"] = recipe.Notes }
  if (recipe.RecipeLink) { params.Item["RecipeLink"] = recipe.RecipeLink }
  if (recipe.WantToTry) { params.Item["WantToTry"] = recipe.WantToTry }

  console.log("Adding to db with params", params)
  return new Promise((resolve, reject) => {
    database
      .put(params, function (err) {
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

module.exports.addUser = (user, password) => {
  const params = {
    TableName: process.env.DYNAMO_TABLE,
    Item: {
      "Name": user,
      "Category": 'USER',
      "Password": password,
      "AdminAccess": false,
    }
  };
  console.log("Trying to add User to the db", user)
  console.log("Adding to db with params", params)
  return new Promise((resolve, reject) => {
    database
      .put(params, function (err) {
        if (err) {
          console.log(`There was an error writing the user to the db`, err);
          return reject(err);
        }
        console.log("User successfully added");
        return resolve(user);
      }
      );
  });
}

module.exports.deleteRecipe = (name) => {
  const params = {
    TableName: process.env.DYNAMO_TABLE,
    Key: {
      'Name': name,
      'Category': 'RECIPE'
    },
  };
  console.log("deleting recipe from db with params", params)
  return new Promise((resolve, reject) => {
    database
      .delete(params, function (err) {
        if (err) {
          console.log(`There was an error deleting this recipe from db`, err);
          return reject(err);
        }
        console.log("Recipes successfully deleted")
        return resolve(name);
      }
      );
  })
};

module.exports.toggleValue = (name, field, flag) => {
  const params = {
    TableName: process.env.DYNAMO_TABLE,
    Key: {
      'Name': name,
      'Category': 'RECIPE'
    },
    UpdateExpression: 'set #k = :v',
    ExpressionAttributeNames: { '#k': field },
    ExpressionAttributeValues: { ':v': flag }
  }
  console.log("updating recipe with params", params)
  return new Promise((resolve, reject) => {
    database.update(params, function (err) {
      if (err) {
        console.log("There was an error updatign the recipe", err)
        return reject(err);
      }
      console.log("Recipe updated successfully")
      return resolve(flag);
    })
  })
}

module.exports.getStoredValues = () => {
  const params = {
    TableName: process.env.DYNAMO_TABLE,
    ProjectionExpression: "Cuisine, Ingredients",
  };

  return new Promise((resolve, reject) => {
    database.scan(params, function (err, data) {
      if (err) {
        console.log(`There was an error scanning the DB`, err)
        return reject(err);
      }
      const cuisines = data.Items.filter(distinctCuisine).map(r => r.Cuisine).sort();

      const allIngredients = data.Items.map(r => r.Ingredients).flat().filter(r => r);
      console.log(allIngredients)
      const ingredients = allIngredients.filter(distinctIngredient).map(i => i.Name).sort();

      const measures = allIngredients
        .filter(distinctMeasurement).map(i => i.Measurement)
        .filter(measure => measure)
        .sort()
      return resolve({
        cuisines,
        ingredients,
        measures
      })
    });
  })
}

const distinctMeasurement = (value, index, self) => self.findIndex(x => x.Measurement === value.Measurement) === index;
const distinctIngredient = (value, index, self) => self.findIndex(x => x.Name === value.Name) === index;
const distinctCuisine = (value, index, self) => self.findIndex(x => x.Cuisine === value.Cuisine) === index;
