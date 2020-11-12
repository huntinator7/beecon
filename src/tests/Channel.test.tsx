import * as React from "react";
import { render, screen } from "@testing-library/react";
import Channel from "../pages/Channel";

test("renders channel in server", () => {
  render(<Channel serverId="0" channelId="0" />);
  const channelName = screen.getByTestId("channel-title");
  const channelId = screen.getByTestId("channel-id");
  expect(channelName).toBeInTheDocument();
  expect(channelId).toBeInTheDocument();
});
