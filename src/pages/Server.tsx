import { RouteComponentProps } from "@reach/router";
import React, { FunctionComponent } from "react";
import styled from "styled-components";

interface Props extends RouteComponentProps {
  serverId?: string;
}

const Server: FunctionComponent<Props> = (props) => {
  return (
    <>
      <S.Title data-testid="server-title">Server Title</S.Title>
      <S.Subtitle data-testid="channel-id">{props.serverId}</S.Subtitle>
    </>
  );
};

export default Server;

const S = {
  Title: styled.h1``,
  Subtitle: styled.h3``,
};
