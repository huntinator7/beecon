import { Router } from "@reach/router";
import React, {
  FunctionComponent,
  Suspense,
  useContext,
  useEffect,
  useRef,
} from "react";
import Home from "./pages/Home";
import Server from "./pages/Server";
import Channel from "./pages/Channel";
import { AuthCheck, SuspenseWithPerf } from "reactfire";
import { G } from "./components";
import { CircleLoader } from "react-spinners";
import styled from "styled-components";
import { StoreContext } from "./store";
import ServerJoin from "./pages/ServerJoin";
import { ErrorBoundary } from "./components/fbErrorCatcher";

export const Routes: FunctionComponent<any> = (props) => {
  const { dispatch } = useContext(StoreContext);
  const mainRef = useRef();
  // const firebase = useFirebaseApp();

  useEffect(() => {
    // console.log(messaging);
    // async function checkNotification() {
    //   const token = await firebase.messaging().getToken();
    //   console.log(token);
    //   Notification.requestPermission()
    //     .then(() => {
    //       return firebase.messaging().getToken();
    //     })
    //     .then((token) => {
    //       console.log(token);
    //     })
    //     .catch((e) => {
    //       console.error(e);
    //     });
    // }
    // checkNotification();
  }, []);

  useEffect(() => {
    dispatch({ type: "SET_MAIN_REF", mainRef });
  }, [dispatch]);

  return (
    <G.Container id="global-container">
      <Suspense fallback="Loading...">
        <G.Navbar {...props} />
      </Suspense>
      <SuspenseWithPerf
        fallback={<CircleLoader />}
        traceId={"sidebar-server-list"}
      >
        <Suspense fallback="Loading...">
          <AuthCheck fallback={<div />}>
            <G.Sidebar {...props} />
          </AuthCheck>
        </Suspense>
      </SuspenseWithPerf>
      <S.Main ref={mainRef} id="page-wrapper">
        <SuspenseWithPerf
          fallback={<CircleLoader />}
          traceId={props.uri ?? "traceId"}
        >
          <ErrorBoundary>
            <Router
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Home path="/" />
              <Server path="/server/:serverId" />
              <ServerJoin path="/server/:serverId/join/:joinCode" />
              <Channel path="/server/:serverId/:channelId" />
            </Router>
          </ErrorBoundary>
        </SuspenseWithPerf>
      </S.Main>
    </G.Container>
  );
};

const S = {
  Main: styled.main`
    padding: 0px;
    width: 100vw;
    height: calc(
      100vh - 64px
    ); /* Fallback for browsers that do not support Custom Properties */
    height: calc(var(--vh, 1vh) * 100 - 64px);
    position: fixed;
    top: 64px;
    left: 0px;
    overflow: auto;
    @media screen and (max-width: 599px) {
      height: calc(
        100vh - 56px
      ); /* Fallback for browsers that do not support Custom Properties */
      height: calc(var(--vh, 1vh) * 100 - 56px);
      top: 56px;
    }
  `,
};
