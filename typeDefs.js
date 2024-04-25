const typeDefs = `#graphql
  type Query {
    greet: String,
    users: [User],
    user(id: ID): User
  }

  type Mutation{
    signupUser(userNew:UserInput!): User
  }

  type User {
    id: ID
    firstName: String
    lastName: String
    email: String
    password: String
  }

  input UserInput {
    firstName: String!
    lastName: String!
    email: String!
    password: String!
  }
`;

export default typeDefs;
