const typeDefs = `#graphql
  type Query {
    greet: String,
    users: [User],
    user(id: ID): User
  }

  type Mutation{
    signupUser(userNew:UserInput!): User
    signinUser(userSignin:UserSigninInput!): Token
  }

  type Token{
    token: String!
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

  input UserSigninInput {
    email: String!
    password: String!
  }
`;

export default typeDefs;
