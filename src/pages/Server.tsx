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
  const firestore = useFirestore();

  const [channelName, setChannelName] = useState("");
  const [discordWebhookUrl, setDiscordWebhookUrl] = useState("");
  const [discordChannelId, setDiscordChannelId] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const serverRef = firestore.collection("Server").doc(props.serverId);
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
      "https://us-central1-beecon-d2a75.cloudfunctions.net/webApi/api/v1/channel/create",
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
        <h1 data-testid="server-title">{server.ServerName}</h1>
        <S.Subtitle>Channels</S.Subtitle>
        <S.ChannelList>
          {channelList.map((c) => (
            <Link to={c.id}>{c.ChannelName}</Link>
          ))}
        </S.ChannelList>
        {isAdmin ? (
          <>
            <S.Subtitle>Admin Functions</S.Subtitle>
            <S.CreateChannel>
              <h3>Create New Channel</h3>
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
          </>
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
