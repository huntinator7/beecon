import React, { FunctionComponent, useEffect, useState } from "react";
import { Link, RouteComponentProps } from "@reach/router";
import * as uuid from "uuid";
import {
  AuthCheck,
  useAuth,
  useFirestore,
  useFirestoreCollectionData,
  useFirestoreDocData,
  useUser,
} from "reactfire";
import styled, { css } from "styled-components";
import "firebase/firestore";
import Login from "./Login";
import { User } from "firebase";

interface Props extends RouteComponentProps {
  serverId?: string;
}

const Server: FunctionComponent<Props> = (props) => {
  const auth = useAuth();
  const user: User = useUser();
  const [channelName, setChannelName] = useState("");
  const [discordWebhookUrl, setDiscordWebhookUrl] = useState("");
  const [discordChannelId, setDiscordChannelId] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const serverRef = useFirestore().collection("Server").doc(props.serverId);
  const channelListRef = serverRef.collection("Channel");
  const userServerRef = serverRef.collection("User").doc(user.uid);
  const server: any = useFirestoreDocData(serverRef);
  const channelList: any[] = useFirestoreCollectionData(channelListRef);
  const userServer: any = useFirestoreDocData(userServerRef);

  const addChannel = async () => {
    const token = await auth.currentUser?.getIdToken();
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", token ?? "");
    myHeaders.append("Cache-Control", "no-cache");

    var body = JSON.stringify({
      serverId: props.serverId,
      channelName,
      discordWebhookUrl: !discordWebhookUrl ? undefined : discordWebhookUrl,
      discordChannelId: !discordChannelId ? undefined : discordChannelId,
    });

    var requestOptions: any = {
      method: "POST",
      headers: myHeaders,
      body,
      redirect: "follow",
    };

    fetch(
      "https://us-central1-beecon-d2a75.cloudfunctions.net/webApi/api/v1/channel",
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => {
        console.log(result);
        setChannelName("");
        setDiscordWebhookUrl("");
        setDiscordChannelId("");
      })
      .catch((error) => console.log("error", error));
  };

  useEffect(() => {
    if (userServer && user) {
      setIsAdmin(userServer.isAdmin);
    }
  }, [user, userServer]);

  return (
    <AuthCheck fallback={<Login />}>
      <S.Container>
        <S.TitleRow>
          <S.Title data-testid="server-title">{server.ServerName}</S.Title>
        </S.TitleRow>
        <S.ChannelList>
          {channelList.map((c) => (
            <Link to={c.id}>{c.ChannelName}</Link>
          ))}
        </S.ChannelList>
        {isAdmin ? (
          <S.CreateChannel>
            <h3>New Channel</h3>
            <input
              value={channelName}
              onChange={(e) => setChannelName(e.target.value)}
              placeholder="Channel Name"
            />
            <input
              value={discordWebhookUrl}
              onChange={(e) => setDiscordWebhookUrl(e.target.value)}
              placeholder="Discord Webhook URL (optional)"
            />
            <input
              value={discordChannelId}
              onChange={(e) => setDiscordChannelId(e.target.value)}
              placeholder="Discord Channel ID (optional)"
            />
            <button onClick={addChannel}>Create</button>
          </S.CreateChannel>
        ) : (
          <></>
        )}
      </S.Container>
    </AuthCheck>
  );
};

export default Server;

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
    max-width: 80vw;
  `,
};

const C = { ...C_1, ...C_2 };

const S = {
  Container: styled.div`
    width: 500px;
  `,
  Title: styled.h1`
    margin-left: 10px;
  `,
  Subtitle: styled.h5`
    margin-left: 20px;
  `,
  TitleRow: styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
  `,
  ChannelList: styled.div`
    ${C.List}
    > a {
      ${C.Button}
      margin-bottom: 20px;
    }
  `,
  CreateChannel: styled.div`
    ${C.List}
    background-color: #dddfe4;
    border: 5px solid #242f40;
    border-radius: 15px;
    > input {
      ${C.FormElement}
      background-color: #ffffff;
      margin-bottom: 10px;
    }
    > button {
      ${C.Button}
    }
    > h3 {
      font-size: 2em;
      text-align: center;
      margin: 0px 0px 20px;
    }
  `,
};
