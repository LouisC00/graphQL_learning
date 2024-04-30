import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { createServer } from "http";
import express from "express";
import jwt from "jsonwebtoken";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import cors from "cors";
import typeDefs from "./typeDefs.js";
import resolvers from "./resolvers.js";
import { makeExecutableSchema } from "@graphql-tools/schema";

// Create the schema, which will be used separately by ApolloServer and the WebSocket server.
const schema = makeExecutableSchema({ typeDefs, resolvers });

// Create an Express app and HTTP server; we will attach both the WebSocket server and the ApolloServer to this HTTP server.
const app = express();
const httpServer = createServer(app);

// Create our WebSocket server using the HTTP server.
const wsServer = new WebSocketServer({
  server: httpServer,
  path: "/subscriptions",
});
const serverCleanup = useServer({ schema }, wsServer);

// Set up ApolloServer.
const server = new ApolloServer({
  schema,
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          },
        };
      },
    },
  ],
});

await server.start();

app.use(cors());
app.use(express.json());
app.use(
  "/graphql",
  expressMiddleware(server, {
    context: async ({ req }) => {
      const { authorization } = req.headers;
      if (authorization) {
        const { userId } = jwt.verify(authorization, process.env.JWT_SECRET);
        return { userId };
      }
    },
  })
);

const PORT = 4000;
httpServer.listen(PORT, () => {
  console.log(`Server is now running on http://localhost:${PORT}/graphql`);
});
