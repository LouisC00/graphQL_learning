import { gql } from "@apollo/client";

export const GET_ALL_USERS = gql`
  query GetAllUsers {
    getAllUsers {
      id
      firstName
      lastName
      email
    }
  }
`;

export const GET_MSG = gql`
  query MessagesByUser($receiverId: Int!, $limit: Int, $offset: Int) {
    messagesByUser(receiverId: $receiverId, limit: $limit, offset: $offset) {
      edges {
        node {
          id
          text
          receiverId
          senderId
          createdAt
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
`;
