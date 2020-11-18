import { Link } from "@reach/router";
import React, { useContext, useEffect } from "react";
import { push as Menu } from "react-burger-menu";
import {
  useFirestore,
  useFirestoreCollection,
  useFirestoreCollectionData,
} from "reactfire";
import styled from "styled-components";
import { StoreContext } from "../store";

const Sidebar = (props: any) => {
  const { state } = useContext(StoreContext);

  const serverRef = useFirestore().collection("Server");
  const serverList = useFirestoreCollectionData(serverRef);

  useEffect(() => {
    console.log(props, state, serverList);
  }, [props, state, serverList]);

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
            {serverList.map((s: any) => (
              <Link className="text-light" to={`/server/${s.id}`}>
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
