import { gql } from "@apollo/client";

export const GET_FRIENDS_FROM_MESSAGES = gql`
  query GetFriendsFromMessages {
    getFriendsFromMessages {
      id
      firstName
      lastName
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
          sender {
            id
            firstName
            lastName
            status
          }
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
