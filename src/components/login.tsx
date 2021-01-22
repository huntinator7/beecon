import React, { FunctionComponent } from "react";
import { useAuth } from "reactfire";
import * as firebase from "firebase";
import { Button } from "@material-ui/core";
import { redirectTo, RouteComponentProps } from "@reach/router";
import styled from "styled-components";

interface Props extends RouteComponentProps {}

const Login: FunctionComponent<Props> = () => {
  const auth = useAuth();

  const signIn = () => {
    let provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope("profile");
    provider.addScope("email");
    auth.signInWithRedirect(provider).then((res) => {
      console.log(res);
      redirectTo("/");
    });
  };
  return (
    <S.Page>
      <Button variant="contained" color="primary" onClick={signIn}>
        Login with Google
      </Button>
    </S.Page>
  );
};

export default Login;

const S = {
  Page: styled.div`
    width: 100%;
    height: calc(100vh - 64px);
    display: flex;
    align-items: center;
    justify-content: center;
  `,
};
