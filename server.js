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

// Create an Express app and HTTP server.
const app = express();
const httpServer = createServer(app);

// WebSocket server setup.
const wsServer = new WebSocketServer({
  server: httpServer,
  path: "/subscriptions",
});

// Function to handle context for WebSocket.
const getDynamicContext = async (ctx, msg, args) => {
  if (ctx.connectionParams && ctx.connectionParams.authToken) {
    try {
      const decoded = jwt.verify(
        ctx.connectionParams.authToken,
        process.env.JWT_SECRET
      );
      return { userId: decoded.userId };
    } catch (error) {
      return { userId: null }; // or handle error as needed
    }
  }
  return { userId: null };
};

// Setup WebSocket server with Apollo.
const serverCleanup = useServer(
  {
    schema,
    context: getDynamicContext,
  },
  wsServer
);

// Apollo Server setup.
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

// Middleware setup.
app.use(cors());
app.use(express.json());
app.use(
  "/graphql",
  expressMiddleware(server, {
    context: async ({ req }) => {
      const { authorization } = req.headers;
      if (authorization) {
        try {
          const decoded = jwt.verify(authorization, process.env.JWT_SECRET);
          return { userId: decoded.userId };
        } catch (error) {
          return { userId: null }; // or handle error as needed
        }
      }
      return { userId: null };
    },
  })
);

// Start the HTTP server.
const PORT = 4000;
httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}/graphql`);
});
