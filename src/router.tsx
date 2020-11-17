import { Router } from "@reach/router";
import React from "react";
import HomeRoute from "./pages/Home";
import ServerRoute from "./pages/Server";
import ChannelRoute from "./pages/Channel";
import wrapPage from "./components/page";

const Home = wrapPage(HomeRoute);
const Server = wrapPage(ServerRoute);
const Channel = wrapPage(ChannelRoute);

export const Routes = () => {
  return (
    <Router>
      <Home path="/" />
      <Server path="/server/:serverId" />
      <Channel path="/server/:serverId/:channelId" />
    </Router>
  );
};
