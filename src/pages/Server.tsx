import React, { FunctionComponent, useEffect, useState } from "react";
import { Link, RouteComponentProps } from "@reach/router";
import * as uuid from "uuid";
import {
  AuthCheck,
  useFirestore,
  useFirestoreCollectionData,
  useFirestoreDocData,
} from "reactfire";
import styled from "styled-components";
import "firebase/firestore";
import Login from "./Login";

interface Props extends RouteComponentProps {
  serverId?: string;
}

const Server: FunctionComponent<Props> = (props) => {
  const [ChannelName, setChannelName] = useState("");

  const serverRef = useFirestore().collection("Server").doc(props.serverId);
  const channelRef = serverRef.collection("Channel");
  const server: any = useFirestoreDocData(serverRef);
  const channelList: any[] = useFirestoreCollectionData(channelRef);

  const addChannel = () => {
    const newChannelId = uuid.v4();
    channelRef.doc(newChannelId).set({ ChannelName, id: newChannelId });
  };

  useEffect(() => {
    console.log(server);
    console.log(channelList);
  }, []);

  return (
    <AuthCheck fallback={<Login />}>
      <S.TitleRow>
        <S.Title data-testid="server-title">{server.ServerName}</S.Title>
        <S.Subtitle data-testid="channel-id">{props.serverId}</S.Subtitle>
      </S.TitleRow>
      <ul style={{ listStyle: "none" }}>
        {channelList.map((c) => (
          <S.Channel>
            <Link className="text-light" to={c.id}>
              {c.ChannelName}
            </Link>
          </S.Channel>
        ))}
      </ul>
      <input
        value={ChannelName}
        onChange={(e) => setChannelName(e.target.value)}
      />
      <button onClick={addChannel}>Create Channel</button>
    </AuthCheck>
  );
};

export default Server;

const S = {
  Title: styled.h1``,
  Subtitle: styled.h5`
    margin-left: 20px;
  `,
  TitleRow: styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
  `,
  Channel: styled.li`
    padding: 10px;
    display: flex;
    flex-direction: column;
  `,
};
