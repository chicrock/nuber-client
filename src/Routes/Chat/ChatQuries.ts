import { gql } from "apollo-boost";

export const GET_CHAT = gql`
  query getChat($chatId: Int!) {
    GetChat(chatId: $chatId) {
      ok
      error
      chat {
        passengerId
        driverId
        messages {
          id
          text
          userId
        }
      }
    }
  }
`;

export const SEND_MESSAGE = gql`
  mutation sendMessage($chatId: Int!, $text: String!) {
    SendChatMessage(chatId: $chatId, text: $text) {
      ok
      error
      message {
        id
        text
        userId
      }
    }
  }
`;

export const SUBSCRIBE_TO_MESSAGES = gql`
  subscription messageSubscription {
    MessageSubscription {
      id
      text
      userId
    }
  }
`;
