import { Link } from "@reach/router";
import React, { useContext } from "react";
import { push as Menu } from "react-burger-menu";
import { useFirestore, useFirestoreCollectionData } from "reactfire";
import styled from "styled-components";
import { StoreContext } from "../store";

const Sidebar = (props: any) => {
  const { state } = useContext(StoreContext);

  const serverRef = useFirestore().collection("Server");
  const serverList = useFirestoreCollectionData(serverRef);

  return (
    <div className="left">
      <Menu
        isOpen={state.sidebarOpen}
        noOverlay
        disableOverlayClick
        width={200}
        pageWrapId="page-wrapper"
        outerContainerId="global-container"
        customBurgerIcon={false}
        customCrossIcon={false}
      >
        <div style={{ height: "100%" }}>
          <S.Sidebar>
            {serverList.map((s: any, i) => (
              <Link className="text-light" to={`/server/${s.id}`} key={i}>
                {s.ServerName}
              </Link>
            ))}
          </S.Sidebar>
        </div>
      </Menu>
    </div>
  );
};

export default Sidebar;

const S = {
  Sidebar: styled.div`
    display: flex;
    flex-direction: column;
    background-color: #242f40;
    height: 100%;
    > a {
      padding: 10px 20px;
      font-weight: bold;
      color: #ffbe30;
      text-decoration: none;
      &:hover {
        color: #242f40;
        background-color: #ffbe30;
      }
    }
    &:focus {
      outline: none;
    }
  `,
};
