const bodyParser = require('body-parser');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const { makeExecutableSchema } = require('graphql-tools');

const typeDefs = require('../graphql/schema');
const resolvers = require('../graphql/resolvers');
const constants = require('./constants');

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

module.exports = app => {
  app.use(bodyParser.json()); // add body-parser as the json parser middleware
  app.use(
    '/graphiql',
    graphiqlExpress({
      endpointURL: constants.GRAPHQL_PATH
    })
  );

  app.use(
    constants.GRAPHQL_PATH,
    graphqlExpress(req => ({
      schema,
      context: {
        event: req.event
      }
    }))
  );
};
