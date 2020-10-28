const { config } = require('aws-sdk');
const dynamodb = require('serverless-dynamodb-client');

config.update({ region: 'eu-west-2' });

const database = dynamodb.doc;
database.apiVersion = '2012-08-10';
module.exports.getNotes = () => {
  const params = {
    TableName: process.env.DYNAMO_TABLE,
    KeyConditionExpression: 'Category = :hkey',
    ExpressionAttributeValues: {
      ':hkey': 'NOTES',
    }
  }

  console.log("contacting db")
  console.log(params)
  return new Promise((resolve, reject) => {
    database
      .query(params, function (err, data) {
        console.log("received data", data)
        console.log("received error", err)
        if (err) {
          console.log(`There was an error fetching the notes from the database`, err);
          return reject(err);
        }
        return resolve(data.Items)
      })
  })
}

module.exports.getNote = (title) => {
  const params = {
    TableName: process.env.DYNAMO_TABLE,
    Key: {
      'Name': title,
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
          console.log(`There was an error fetching the note ${title} from the database`, err);
          return reject(err);
        }
        if (!data.Item) return resolve(null);

        return resolve(data.Item)
      })
  })
}

module.exports.updateNotes = (title, notes) => {
  const params = {
    TableName: process.env.DYNAMO_TABLE,
    Item: {
      "Name": title,
      "Category": 'NOTES',
      "Data": notes
    }
  };
  console.log(`Trying to update ${title} in the db`)
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

module.exports.deleteNote = (title) => {
  const params = {
    TableName: process.env.DYNAMO_TABLE,
    Key: {
      'Name': title,
      'Category': 'NOTES'
    },
  };
  console.log("deleting notes from db with params", params)
  return new Promise((resolve, reject) => {
    database
      .delete(params, function (err) {
        if (err) {
          console.log(`There was an error deleting this note from db`, err);
          return reject(err);
        }
        console.log("Note successfully deleted")
        return resolve(title);
      }
      );
  })
};