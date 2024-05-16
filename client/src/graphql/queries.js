import { gql } from "@apollo/client";

export const GET_ALL_USERS = gql`
  query GetAllUsers {
    getAllUsers {
      id
      firstName
      lastName
      email
      status
    }
  }
`;

export const GET_MSG = gql`
  query MessagesByUser($receiverId: Int!, $limit: Int, $cursor: ID) {
    messagesByUser(receiverId: $receiverId, limit: $limit, cursor: $cursor) {
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

export const GET_CURRENT_USER_STATUS = gql`
  query GetCurrentStatus {
    getCurrentUserStatus {
      id
      status
    }
  }
`;
