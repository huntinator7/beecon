import React, { FunctionComponent } from "react";
import { RouteComponentProps } from "@reach/router";
import styled from "styled-components";

interface Props extends RouteComponentProps {}

const Home: FunctionComponent<Props> = (_props) => {
  return <S.Title>Welcome To Beecon</S.Title>;
};

export default Home;

const S = {
  Title: styled.h1``,
};
