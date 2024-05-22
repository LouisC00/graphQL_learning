import { gql } from "@apollo/client";

export const SIGNUP_USER = gql`
  mutation SignupUser($userNew: UserInput!) {
    signupUser(userNew: $userNew) {
      id
      email
      firstName
      lastName
    }
  }
`;

export const LOGIN_USER = gql`
  mutation SigninUser($userSignin: UserSigninInput!) {
    signinUser(userSignin: $userSignin) {
      token
    }
  }
`;

export const SEND_MSG = gql`
  mutation CreateMessage($receiverId: Int!, $text: String!) {
    createMessage(receiverId: $receiverId, text: $text) {
      id
      text
      receiverId
      senderId
      createdAt
    }
  }
`;

export const UPDATE_USER_STATUS = gql`
  mutation UpdateUserStatus($status: String!) {
    updateUserStatus(status: $status) {
      id
      firstName
      lastName
      email
      status
    }
  }
`;

export const ADD_FRIEND = gql`
  mutation AddFriend($friendId: Int!) {
    addFriend(friendId: $friendId) {
      id
      firstName
      lastName
      email
    }
  }
`;
