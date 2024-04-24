import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { randomUUID } from "crypto";

const users = [
  {
    id: "001",
    firstName: "mukesh",
    lastName: "kumar",
    email: "mukesh@mueshkumar.com",
    password: "12345",
  },
  {
    id: "002",
    firstName: "suresh",
    lastName: "sjarma",
    email: "suresh@sureshsharma.com",
    password: "12346",
  },
];

const Todos = [
  {
    title: "buy book",
    by: "001",
  },
  {
    title: "write code",
    by: "001",
  },
  {
    title: "record video",
    by: "002",
  },
];

const typeDefs = `#graphql
  type Query {
    greet: String,
    users: [User],
    user(id: ID): User
  }

  type Mutation {
    createUser(userNew: UserInput!): User
}

  type User {
    id: ID
    firstName: String
    lastName: String
    email: String
    password: String
    todos:[Todo]
  }

  input UserInput {
    firstName: String!
    lastName: String!
    email: String!
    password: String!
  }

  type Todo{
    title: String
    by: ID!
  }
`;

const resolvers = {
  Query: {
    greet: () => "Hello world",
    users: () => users,
    user: (parent, args, { userLoggedIn }) => {
      if (!userLoggedIn) throw new Error("you are not logged in");
      // Find and return the user whose ID matches the provided argument
      return users.find((user) => user.id === args.id);
    },
  },
  User: {
    // This block is activated for fields of the 'User' type when they are requested in a query or mutation.
    todos: (parent) => {
      // Triggered if 'todos' is requested in a query involving a 'User'. 'Parent' is the user object.
      // console.log(parent);
      return Todos.filter((todo) => todo.by == parent.id);
    },
    id: (parent) => {
      // console.log(parent);
      return parent.id; // if i don't type the return, it won't return anything. this can be treated as a return override function
    },
    // firstName: (parent) => {
    //   // so that would return the lastName when you fetch the firstName (in a return type of User)
    //   return parent.lastName; // would always return the lastName
    // },
  },
  Mutation: {
    createUser: (_, { userNew }) => {
      const newUser = {
        id: randomUUID(),
        ...userNew,
      };
      users.push(newUser);
      return newUser;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req }) => ({
    userLoggedIn: true,
  }),
});

console.log(`🚀 Server ready at: ${url}`);
