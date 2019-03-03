import React from "react";
import Helmet from "react-helmet";
import Header from "src/Components/Header";
import Message from "src/Components/Message";
import styled from "../../typed-components";

const Container = styled.div``;

interface IProps {
  data?: any;
  loading: boolean;
  userData?: any;
}

const ChatPresenter: React.SFC<IProps> = ({
  data: { GetChat: { chat = null } = {} } = {},
  loading,
  userData: { GetMyProfile: { user = null } = {} } = {},
}) => {
  return (
    <Container>
      <Helmet>
        <title>Chat | Nuber</title>
      </Helmet>
      <Header title={"Chat"} backTo={"/"} />
      {!loading && chat && user && (
        <React.Fragment>
          {chat.messages &&
            chat.messages.map(message => {
              if (message) {
                return (
                  <Message
                    key={message.id}
                    text={message.text}
                    mine={user.id === message.userId}
                  />
                );
              } else {
                return null;
              }
            })}
        </React.Fragment>
      )}
    </Container>
  );
};

export default ChatPresenter;
