import { RouteComponentProps } from "@reach/router";
import React, { FunctionComponent, Suspense, useEffect } from "react";
import { CircleLoader } from "react-spinners";
import { SuspenseWithPerf } from "reactfire";
import { G } from ".";

interface Props extends RouteComponentProps {}

const wrapPage = (Component: FunctionComponent<any>) => (props: Props) => {
  useEffect(() => {
    console.log(props);
  });
  return (
    <G.Container id="global-container">
      <G.Navbar {...props} />
      <SuspenseWithPerf
        fallback={<CircleLoader />}
        traceId={"sidebar-server-list"}
      >
        <G.Sidebar {...props} />
      </SuspenseWithPerf>
      <main id="page-wrapper">
        <SuspenseWithPerf
          fallback={<CircleLoader />}
          traceId={props.uri ?? "traceId"}
        >
          <Component {...props} />
        </SuspenseWithPerf>
      </main>
    </G.Container>
  );
};

export default wrapPage;
