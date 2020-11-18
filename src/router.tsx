import { Router } from "@reach/router";
import React, { FunctionComponent } from "react";
import Home from "./pages/Home";
import Server from "./pages/Server";
import Channel from "./pages/Channel";
import { SuspenseWithPerf } from "reactfire";
import { G } from "./components";
import { CircleLoader } from "react-spinners";
import styled from "styled-components";

export const Routes: FunctionComponent<any> = (props) => {
  return (
    <G.Container id="global-container">
      <G.Navbar {...props} />
      <SuspenseWithPerf
        fallback={<CircleLoader />}
        traceId={"sidebar-server-list"}
      >
        <G.Sidebar {...props} />
      </SuspenseWithPerf>
      <S.Main id="page-wrapper">
        <SuspenseWithPerf
          fallback={<CircleLoader />}
          traceId={props.uri ?? "traceId"}
        >
          <Router>
            <Home path="/" />
            <Server path="/server/:serverId" />
            <Channel path="/server/:serverId/:channelId" />
          </Router>
        </SuspenseWithPerf>
      </S.Main>
    </G.Container>
  );
};

const S = {
  Main: styled.main`
    padding: 0px 20px;
    width: calc(100vw - 240px);
    height: calc(100vh - 64px);
    position: fixed;
    bottom: 0px;
    left: 200px;
    overflow: auto;
  `,
};
