import React, { FunctionComponent, useEffect } from "react";
import { RouteComponentProps } from "@reach/router";
import { AuthCheck, useAuth } from "reactfire";
import styled from "styled-components";

import Login from "./Login";

interface Props extends RouteComponentProps {
  serverId?: string;
  joinCode?: string;
}

const ServerJoin: FunctionComponent<Props> = (props) => {
  const auth = useAuth();

  const joinServer = async () => {
    const token = await auth.currentUser?.getIdToken();
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", token ?? "");
    myHeaders.append("Cache-Control", "no-cache");

    var body = JSON.stringify({
      serverId: props.serverId,
      joinCode: props.joinCode,
    });

    var requestOptions: any = {
      method: "POST",
      headers: myHeaders,
      body,
      redirect: "follow",
    };

    fetch(
      "https://us-central1-beecon-d2a75.cloudfunctions.net/webApi/api/v1/server/join",
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => {
        console.log(result);
      })
      .catch((error) => console.log("error", error));
  };

  useEffect(() => {
    joinServer();
  }, []);
  return (
    <AuthCheck fallback={<Login />}>
      <S.Container></S.Container>
    </AuthCheck>
  );
};

export default ServerJoin;

const S = {
  Container: styled.div`
    width: 500px;
    max-width: 100vw;
    display: flex;
    flex-direction: column;
    justify-content: center;
    justify-self: center;
    h1,
    h2,
    h3 {
      text-align: center;
      color: #242f40;
    }
  `,
};
