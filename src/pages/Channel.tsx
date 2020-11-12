import { RouteComponentProps } from "@reach/router";
import React from "react";
import styled from "styled-components";
import { G } from "../components";

interface Props extends RouteComponentProps {
  serverId?: string;
  channelId?: string;
}

const Channel = (props: Props) => {
  return (
    <G.Page>
      <>
        <S.Title data-testid="channel-title">Channel Title</S.Title>
        <S.Subtitle data-testid="channel-id">{props.channelId}</S.Subtitle>
      </>
    </G.Page>
  );
};

export default Channel;

const S = {
  Title: styled.h1``,
  Subtitle: styled.h3``,
};
