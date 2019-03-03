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
import { GET_CHAT, SEND_MESSAGE } from "./ChatQuries";

interface IProps extends RouteComponentProps<any> {
  chatId: number;
}
interface IState {
  message: "";
}

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
            {({ data, loading }) => (
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
            )}
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
}

export default ChatContainer;
