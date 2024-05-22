const typeDefs = `#graphql
  type Query {
    getFriendsFromMessages: [User]
    messagesByUser(receiverId: Int!, cursor: ID, limit: Int = 10): MessageConnection
    getCurrentUserStatus: UserStatus
  }

  type Mutation {
    signupUser(userNew: UserInput!): User
    signinUser(userSignin: UserSigninInput!): Token
    createMessage(receiverId: Int!, text: String!): Message
    updateUserStatus(status: String!): User
    addFriend(friendId: Int!): AddFriendResponse
    removeFriend(friendId: Int!): User
  }

  type Subscription {
    messageAdded: Message
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

  type AddFriendResponse {
    id: ID!
    firstName: String!
    lastName: String!
    status: String
  }

  scalar Date

  type Message {
    id: ID!
    text: String!
    receiverId: Int!
    senderId: Int!
    sender: User!
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
`;

export default typeDefs;
