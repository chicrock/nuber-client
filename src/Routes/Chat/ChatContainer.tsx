import React from "react";
import { Query } from "react-apollo";
import { RouteComponentProps } from "react-router";
import { USER_PROFILE } from "src/sharedQueries";
import { getChat, getChatVariables, userProfile } from "src/types/api";
import ChatPresenter from "./ChatPresenter";
import { GET_CHAT } from "./ChatQuries";

interface IProps extends RouteComponentProps<any> {
  chatId: number;
}

class ProfileQuery extends Query<userProfile> {}
class ChatQuery extends Query<getChat, getChatVariables> {}

class ChatContainer extends React.Component<IProps> {
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
  }

  public render() {
    const {
      match: {
        params: { chatId },
      },
    } = this.props;

    return (
      <ProfileQuery query={USER_PROFILE}>
        {({ data: userData }) => (
          <ChatQuery
            query={GET_CHAT}
            variables={{ chatId: parseInt(chatId, 10) }}
          >
            {({ data, loading }) => (
              <ChatPresenter
                data={data}
                loading={loading}
                userData={userData}
              />
            )}
          </ChatQuery>
        )}
      </ProfileQuery>
    );
  }
}

export default ChatContainer;
