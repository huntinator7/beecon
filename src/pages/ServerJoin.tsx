import React, { FunctionComponent, useEffect, useState } from "react";
import { navigate, RouteComponentProps } from "@reach/router";
import { AuthCheck, useAuth } from "reactfire";
import styled, { css } from "styled-components";
import "firebase/firestore";
import Login from "../components/login";

interface Props extends RouteComponentProps {
  serverId?: string;
  joinCode?: string;
}

const ServerJoin: FunctionComponent<Props> = (props) => {
  const auth = useAuth();

  const [joinText, setJoinText] = useState("Attempting to join server");

  useEffect(() => {
    async function joinServerWithCode() {
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
          setJoinText("Successfully joined server! Redirecting you now...");
          setTimeout(function () {
            navigate(`/server/${props.serverId}`);
          }, 3000);
        })
        .catch((error) => {
          console.log("error", error);
          setJoinText("Unable to join server");
          setTimeout(function () {
            navigate(`/login`);
          }, 3000);
        });
    }
    joinServerWithCode();
  }, [auth.currentUser, props.joinCode, props.serverId]);

  return (
    <AuthCheck fallback={<Login />}>
      <S.Container>
        <h1 data-testid="join-text">{joinText}</h1>
      </S.Container>
    </AuthCheck>
  );
};

export default ServerJoin;

const C_1 = {
  FormElement: css`
    padding: 5px;
    font-size: 1.7em;
    border: 2px solid #242f40;
    border-radius: 5px;
    color: #242f40;
  `,
};

const C_2 = {
  Button: css`
    ${C_1.FormElement}
    background-color: #ffbe30;
    text-decoration: none;
    font-weight: bold;
    text-align: center;
    &:hover {
      background-color: #242f40;
      color: #ffbe30;
      cursor: pointer;
    }
  `,
  List: css`
    display: flex;
    flex-direction: column;
    padding: 20px;
    margin: 10px;
    background-color: #dddfe4;
    border: 5px solid #242f40;
    border-radius: 15px;
    > * {
      margin-bottom: 10px;
      &:last-child {
        margin-bottom: 0px;
      }
    }
  `,
};

const C = { ...C_1, ...C_2 };

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
  Title: styled.h1``,
  Subtitle: styled.h2`
    margin: 10px 0px 0px;
  `,
  ChannelList: styled.div`
    ${C.List}
    > a {
      ${C.Button}
    }
  `,
  CreateChannel: styled.div`
    ${C.List}
    > input, select {
      ${C.FormElement}
      background-color: #ffffff;
    }
    > button {
      ${C.Button}
    }
    > h3 {
      margin-top: 0px;
    }
  `,
};
