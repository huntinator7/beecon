import { RouteComponentProps } from "@reach/router";
import React from "react";
import styled from "styled-components";
import { G } from "../components";

interface Props extends RouteComponentProps {
  serverId?: string;
}

const Server = (props: Props) => {
  return (
    <G.Page>
      <>
        <S.Title data-testid="server-title">Server Title</S.Title>
        <S.Subtitle data-testid="channel-id">{props.serverId}</S.Subtitle>
      </>
    </G.Page>
  );
};

export default Server;

const S = {
  Title: styled.h1``,
  Subtitle: styled.h3``,
};
