import React from "react";
import { RouteComponentProps } from "@reach/router";
import { G } from "../components";
import styled from "styled-components";

interface Props extends RouteComponentProps {}

const Home = (_props: Props) => {
  return (
    <G.Page>
      <S.Title>Welcome To Beecon</S.Title>
    </G.Page>
  );
};

export default Home;

const S = {
  Title: styled.h1``,
};
