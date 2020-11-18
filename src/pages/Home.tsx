import React, { FunctionComponent, useState } from "react";
import { RouteComponentProps } from "@reach/router";
import styled from "styled-components";
import * as uuid from "uuid";
import {
  useFirestore,
} from "reactfire";

interface Props extends RouteComponentProps {}

const Home: FunctionComponent<Props> = (_props) => {
  const [ServerName, setServerName] = useState("");
  const serversRef = useFirestore().collection("Server");
  const addServer = () => {
    const newServerId = uuid.v4();
    serversRef
      .doc(newServerId)
      .set({ ServerName, id: newServerId })
      .then(() => {
        const newChannelId = uuid.v4();
        serversRef
          .doc(newServerId)
          .collection("Channel")
          .doc(newChannelId)
          .set({
            ChannelName: "General",
            id: newChannelId,
          });
      });
  };
  return (
    <>
      <S.Title>Welcome To Beecon</S.Title>
      <input
        value={ServerName}
        onChange={(e) => setServerName(e.target.value)}
      />
      <button onClick={addServer}>Create Server</button>
    </>
  );
};

export default Home;

const S = {
  Title: styled.h1``,
};
