const { resolvers } = require("./resolvers");
const { schema } = require( "./schema");
const { graphql, buildSchema } = require('graphql');

module.exports.query = (event, context, callback) => {
  return graphql(buildSchema(schema), event.body, resolvers, { authToken: event.headers ? event.headers['Authorization'] : null })
.then(
  result => {
    const response = {
      statusCode: 200,
      body: JSON.stringify(result),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Credentials": true
      }
    };

    if (result.token) {
      console.log("Adding token to cookie")
      response.cookie('emmas-recipes-token', result.token, { httpOnly: true });
    }
    callback(null, response)
  },
  err => callback(err)
)
}
