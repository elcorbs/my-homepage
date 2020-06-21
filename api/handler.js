const { resolvers } = require("./resolvers");
const { schema } = require( "./schema");
const { makeExecutableSchema } = require('graphql-tools');
const { gql } = require('apollo-server');
const { graphql } = require('graphql');

const myGraphQLSchema = makeExecutableSchema({
  typeDefs: gql(schema),
  resolvers: resolvers,
});

module.exports.query = (event, context, callback) => graphql(myGraphQLSchema, event.queryStringParameters.query)
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
