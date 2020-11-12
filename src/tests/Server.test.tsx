import * as React from "react";
import { render, screen } from "@testing-library/react";
import Server from "../pages/Server";

test("renders server", () => {
  render(<Server serverId="0" />);
  const serverTitle = screen.getByTestId("server-title");
  const serverId = screen.getByTestId("server-id");
  expect(serverTitle).toBeInTheDocument();
  expect(serverId).toBeInTheDocument();
});
