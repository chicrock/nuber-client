import { SubscribeToMoreOptions } from "apollo-boost";
import React from "react";
import { Mutation, MutationFn, Query } from "react-apollo";
import { RouteComponentProps } from "react-router";
import { USER_PROFILE } from "src/sharedQueries";
import {
  getChat,
  getChatVariables,
  sendMessage,
  sendMessageVariables,
  userProfile,
} from "src/types/api";
import ChatPresenter from "./ChatPresenter";
import { GET_CHAT, SEND_MESSAGE, SUBSCRIBE_TO_MESSAGES } from "./ChatQuries";

interface IProps extends RouteComponentProps<any> {
  chatId: number;
}
interface IState {
  message: "";
}
interface IChatSubscribeToMoreOptions
  extends SubscribeToMoreOptions<any, getChatVariables, any> {}

class ProfileQuery extends Query<userProfile> {}
class ChatQuery extends Query<getChat, getChatVariables> {}
class SendMessage extends Mutation<sendMessage, sendMessageVariables> {}

class ChatContainer extends React.Component<IProps, IState> {
  public sendMessageFn: MutationFn;

  constructor(props: IProps) {
    super(props);

    const {
      history,
      match: {
        params: { chatId },
      },
    } = props;

    if (!chatId) {
      history.push("/");
    }

    this.state = {
      message: "",
    };
  }

  public render() {
    const {
      match: {
        params: { chatId },
      },
    } = this.props;

    const { message } = this.state;

    return (
      <ProfileQuery query={USER_PROFILE}>
        {({ data: userData }) => (
          <ChatQuery
            query={GET_CHAT}
            variables={{ chatId: parseInt(chatId, 10) }}
          >
            {({ data, loading, subscribeToMore }) => {
              const subscribeToMoreOption: IChatSubscribeToMoreOptions = {
                document: SUBSCRIBE_TO_MESSAGES,
                updateQuery: this.handleSubscriptionUpdate,
              };

              subscribeToMore(subscribeToMoreOption);

              return (
                <SendMessage mutation={SEND_MESSAGE}>
                  {sendMessageFn => {
                    this.sendMessageFn = sendMessageFn;

                    return (
                      <ChatPresenter
                        data={data}
                        loading={loading}
                        userData={userData}
                        messageText={message}
                        onInputChange={this.onInputChange}
                        onSubmit={this.onSubmit}
                      />
                    );
                  }}
                </SendMessage>
              );
            }}
          </ChatQuery>
        )}
      </ProfileQuery>
    );
  }

  public onInputChange: React.ChangeEventHandler<HTMLInputElement> = event => {
    const {
      target: { name, value },
    } = event;

    this.setState({
      [name]: value,
    } as any);
  };

  public onSubmit: React.FormEventHandler<HTMLFormElement> = () => {
    const { message } = this.state;
    const {
      match: {
        params: { chatId },
      },
    } = this.props;

    if (message && message !== "") {
      this.sendMessageFn({
        variables: {
          chatId: parseInt(chatId, 10),
          text: message,
        },
      });

      this.setState({
        message: "",
      });
    }
  };

  public handleSubscriptionUpdate = (prev, { subscriptionData }) => {
    if (!subscriptionData.data) {
      return prev;
    }

    const {
      data: { MessageSubscription },
    } = subscriptionData;
    const {
      GetChat: {
        chat: { messages },
      },
    } = prev;

    const newMessageId = MessageSubscription.id;
    const latestMessageId = messages[messages.length - 1].id;

    if (newMessageId === latestMessageId) {
      return prev;
    }

    const newObject = Object.assign({}, prev, {
      GetChat: {
        ...prev.GetChat,
        chat: {
          ...prev.GetChat.chat,
          messages: [
            ...prev.GetChat.chat.messages,
            subscriptionData.data.MessageSubscription,
          ],
        },
      },
    });

    return newObject;
  };
}

export default ChatContainer;
