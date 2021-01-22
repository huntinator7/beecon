import { navigate } from "@reach/router";
import { User } from "firebase";
import React, { useContext, useEffect } from "react";
import { slide as Menu } from "react-burger-menu";
import {
  useFirestore,
  useFirestoreCollectionData,
  useFirestoreDocData,
  useUser,
} from "reactfire";
import styled from "styled-components";
import { StoreContext } from "../store";

const Sidebar = (_props: any) => {
  const { state, dispatch } = useContext(StoreContext);
  const user: User = useUser();
  const db = useFirestore();

  const userRef = db.collection("User").doc(user?.uid || "a");
  const userFS: any = useFirestoreDocData(userRef);

  const serverRef = db
    .collection("Server")
    .where("id", "in", userFS?.servers || ["a"]);
  const serverList = useFirestoreCollectionData(serverRef);

  const sidebarClick = (id: string) => {
    dispatch({ type: "TOGGLE_SIDEBAR" });
    navigate(`/server/${id}`);
  };

  useEffect(() => {
    console.log(user, userFS);
  }, [user, userFS]);

  return (
    <S.SidebarContainer className="left">
      <Menu
        isOpen={state.sidebarOpen}
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
              <button
                className="text-light"
                onClick={() => sidebarClick(s.id)}
                key={i}
              >
                {s.ServerName}
              </button>
            ))}
          </S.Sidebar>
        </div>
      </Menu>
    </S.SidebarContainer>
  );
};

export default Sidebar;

const S = {
  SidebarContainer: styled.div`
    &,
    .bm-menu,
    .bm-item-list,
    .bm-item {
      &:focus {
        outline: none;
      }
    }
  `,
  Sidebar: styled.div`
    display: flex;
    flex-direction: column;
    background-color: #242f40;
    height: 100%;
    > button {
      text-align: left;
      padding: 10px 20px;
      font-weight: bold;
      color: #ffbe30;
      background-color: #242f40;
      text-decoration: none;
      border: none;
      &:hover {
        color: #242f40;
        background-color: #ffbe30;
        cursor: pointer;
      }
    }
    &:focus {
      outline: none;
    }
  `,
};
