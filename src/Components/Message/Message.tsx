import React from "react";
import styled from "../../typed-components";

const Container = styled("div")<{ mine: boolean }>``;

interface IProps {
  text: string;
  mine: boolean;
}

const Message: React.SFC<IProps> = ({ text, mine }) => (
  <Container mine={mine}>{text}</Container>
);

export default Message;
