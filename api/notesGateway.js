const { DynamoDB, config } = require('aws-sdk');

config.update({ region: 'eu-west-2' });
const database = new DynamoDB.DocumentClient({
  apiVersion: '2012-08-10',
});

module.exports.getNotes = () => {
  const params = {
    TableName: process.env.DYNAMO_TABLE,
    Key: {
      'Name': 'Emmas notes',
      'Category': 'NOTES'
    }
  }

  console.log("contacting db")
  return new Promise((resolve, reject) => {
    database
      .get(params, function (err, data) {
        console.log("received data", data)
        console.log("received error", err)
        if (err) {
          console.log(`There was an error fetching the notes from the database`, err);
          return reject(err);
        }
        if (!data.Item) return resolve(null);

        return resolve(data.Item.Data)
      })
  })
}

module.exports.updateNotes = (notes) => {
  const params = {
    TableName: process.env.DYNAMO_TABLE,
    Item: {
      "Name": 'Emmas notes',
      "Category": 'NOTES',
      "Data": notes
    }
  };
  console.log("Trying to update Emmas notes User to the db")
  console.log("Adding to db with params", params)
  return new Promise((resolve, reject) => {
    database
      .put(params, function (err) {
        if (err) {
          console.log(`There was an error saving the notes to the db`, err);
          return reject(err);
        }
        console.log("Notes successfully saved");
        return resolve(notes);
      }
      );
  });
}