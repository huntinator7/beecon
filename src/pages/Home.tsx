import React, { FunctionComponent, useState } from "react";
import { RouteComponentProps } from "@reach/router";
import styled from "styled-components";
import { AuthCheck, useAuth } from "reactfire";
import Login from "./Login";

interface Props extends RouteComponentProps {}

const Home: FunctionComponent<Props> = (_props) => {
  const auth = useAuth();
  const [serverName, setServerName] = useState("");

  const createServer = async () => {
    const token = await auth.currentUser?.getIdToken();
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", token ?? "");
    myHeaders.append("Cache-Control", "no-cache");

    var body = JSON.stringify({
      serverName,
    });

    var requestOptions: any = {
      method: "POST",
      headers: myHeaders,
      body,
      redirect: "follow",
    };

    fetch(
      "https://us-central1-beecon-d2a75.cloudfunctions.net/webApi/api/v1/server/create",
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => {
        console.log(result);
      })
      .catch((error) => console.log("error", error));
  };

  return (
    <AuthCheck fallback={<Login />}>
      <S.Container>
        <h1>Welcome To Beecon</h1>
        <input
          value={serverName}
          onChange={(e) => setServerName(e.target.value)}
        />
        <button onClick={createServer}>Create Server</button>
      </S.Container>
    </AuthCheck>
  );
};

export default Home;

const S = {
  Title: styled.h1``,
  Container: styled.div`
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
