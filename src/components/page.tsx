import React, { FunctionComponent } from "react";
import { G } from ".";

interface Props {}

const Page: FunctionComponent<Props> = (props) => (
  <G.Container id="global-container">
    <G.Navbar />
    <G.Sidebar />
    <main id="page-wrapper">{props.children}</main>
  </G.Container>
);

export default Page;
