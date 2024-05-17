const typeDefs = `#graphql
  type Query {
    greet: String
    getAllUsers: [User]
    messagesByUser(receiverId: Int!, cursor: ID, limit: Int = 10): MessageConnection
    getCurrentUserStatus: UserStatus
    getUserFriends: [User]
    getUserAddedBy: User
  }

  type Mutation {
    signupUser(userNew: UserInput!): User
    signinUser(userSignin: UserSigninInput!): Token
    createMessage(receiverId: Int!, text: String!): Message
    updateUserStatus(status: String!): User
    addFriend(friendId: Int!): User
    removeFriend(friendId: Int!): User
  }

  type Token {
    token: String!
  }

  type User {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
    password: String!
    status: String
    friends: [User]
    addedBy: User
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

  type UserStatus {
    id: ID!
    status: String
  }

  scalar Date

  type Message {
    id: ID!
    text: String!
    receiverId: Int!
    senderId: Int!
    createdAt: Date!
  }

  type MessageConnection {
    edges: [MessageEdge]
    pageInfo: PageInfo
  }

  type MessageEdge {
    node: Message
  }

  type PageInfo {
    endCursor: ID
    hasNextPage: Boolean
  }

  type Subscription {
    messageAdded: Message
  }
`;

export default typeDefs;
