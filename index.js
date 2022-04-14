const express = require("express");
const { createServer } = require("http");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const { SubscriptionServer } = require("subscriptions-transport-ws");
const { execute, subscribe } = require("graphql");
const { ApolloServer } = require("apollo-server-express");
const mongoose = require("mongoose");

const typeDefs = require("./graphql/typeDefs.js");
const resolvers = require("./graphql/resolvers.js");

const MongoURL =
  "mongodb+srv://admin:admin123@graphql-cluster.tvsnc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

(async function () {
  console.log("Hello World");

  const app = express();
  const httpServer = createServer(app);

  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });

  const subscriptionServer = SubscriptionServer.create(
    {
      schema,
      execute,
      subscribe,
    },
    { server: httpServer, path: "/graphql" }
  );

  const server = new ApolloServer({
    schema,
    plugins: [
      {
        async serverWillStart() {
          return {
            async drainServer() {
              subscriptionServer.close();
            },
          };
        },
      },
    ],
  });

  await server.start();

  server.applyMiddleware({ app });

  mongoose.connect(MongoURL, { useNewUrlParser: true });

  const PORT = 4000;

  httpServer.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
  });
})();
