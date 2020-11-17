import { RouteComponentProps } from "@reach/router";
import React, { FunctionComponent } from "react";
import styled from "styled-components";

interface Props extends RouteComponentProps {
  serverId?: string;
  channelId?: string;
}

const Channel: FunctionComponent<Props> = (props) => {
  return (
    <>
      <S.Title data-testid="channel-title">Channel Title</S.Title>
      <S.Subtitle data-testid="channel-id">{props.channelId}</S.Subtitle>
    </>
  );
};

export default Channel;

const S = {
  Title: styled.h1``,
  Subtitle: styled.h3``,
};
