import React from "react";
import { push as Menu } from "react-burger-menu";
import styled from "styled-components";

const Sidebar = () => (
  <div className="left">
    <Menu
      isOpen={true}
      noOverlay
      disableOverlayClick
      width={200}
      pageWrapId="page-wrapper"
      outerContainerId="global-container"
      customBurgerIcon={false}
      customCrossIcon={false}
    >
      <div style={{ height: "100%" }}>
        <S.Sidebar className="bg-dark">
          <a className="text-light" href="/server/0">
            Default Server
          </a>
          <a className="text-light" href="/server/0/0">
            Default Channel
          </a>
          <a className="text-light" href="/server/1/2">
            Other Channels 1
          </a>
          <a className="text-light" href="/server/0/4">
            Other Channels 2
          </a>
          <a className="text-light" href="/server/12/6">
            Other Channels 3
          </a>
        </S.Sidebar>
      </div>
    </Menu>
  </div>
);

export default Sidebar;

const S = {
  Sidebar: styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    > a {
      padding: 10px;
      font-weight: bold;
    }
  `,
};
