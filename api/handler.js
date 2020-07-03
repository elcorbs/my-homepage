const { resolvers } = require("./resolvers");
const { schema } = require( "./schema");
const { graphql, buildSchema } = require('graphql');

module.exports.query = (event, context, callback) => {
  return graphql(buildSchema(schema), event.body, resolvers)
.then(
  result => {
    callback(null, {
      statusCode: 200,
      body: JSON.stringify(result),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Credentials": true
      }
    })
  },
  err => callback(err)
)
}
