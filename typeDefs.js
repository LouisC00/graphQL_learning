const typeDefs = `#graphql
  type Query {
    greet: String,
    getAllUsers: [User],
    messagesByUser(receiverId: Int!):[Message]
  }

  type Mutation{
    signupUser(userNew:UserInput!): User
    signinUser(userSignin:UserSigninInput!): Token
    createMessage(receiverId: Int!, text: String!): Message
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

  scalar Date

  type Message{
    id: ID!
    text: String!
    receiverId: Int!
    senderId: Int!
    createdAt: Date!
  }

  type Subscription {
    messageAdded: Message
  }
`;

export default typeDefs;
