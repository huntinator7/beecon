import { RouteComponentProps } from "@reach/router";
import React, { FunctionComponent, Suspense } from "react";
import { CircleLoader } from "react-spinners";
import { G } from ".";

interface Props extends RouteComponentProps {}

const wrapPage = (Component: FunctionComponent<any>) => (props: Props) => {
  return (
    <G.Container id="global-container">
      <G.Navbar {...props} />
      <G.Sidebar {...props} />
      <main id="page-wrapper">
        <Suspense fallback={<CircleLoader />}>
          <Component {...props} />
        </Suspense>
      </main>
    </G.Container>
  );
};

export default wrapPage;
