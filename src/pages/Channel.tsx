import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { RouteComponentProps } from "@reach/router";
import * as uuid from "uuid";
import {
  AuthCheck,
  useAuth,
  useFirestore,
  useFirestoreCollectionData,
  useFirestoreDocData,
  useUser,
} from "reactfire";
import styled from "styled-components";
import {
  Avatar,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  makeStyles,
  TextField,
  Typography,
} from "@material-ui/core";
import { formatRelative } from "date-fns";
import { StoreContext } from "../store";
import Login from "./Login";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    backgroundColor: "#dddfe4",
    minHeight: "100vh",
  },
  inline: {
    display: "inline",
  },
}));

interface Props extends RouteComponentProps {
  serverId?: string;
  channelId?: string;
}

const Channel: FunctionComponent<Props> = (props) => {
  const user: any = useUser();
  const auth = useAuth();
  const { dispatch } = useContext(StoreContext);
  const classes = useStyles();

  const [message, setMessage] = useState("");
  const [token, setToken] = useState("");
  const messageBoxRef: any = useRef();

  const serverRef = useFirestore().collection("Server").doc(props.serverId);
  const channelRef = serverRef.collection("Channel").doc(props.channelId);
  const messagesRef = channelRef.collection("Message");

  const channel: any = useFirestoreDocData(channelRef);
  const messages: any[] = useFirestoreCollectionData(
    messagesRef.orderBy("timeSent")
  );

  const sendMessage = () => {
    if (!message) return;
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", token);

    var raw = JSON.stringify({
      channelId: props.channelId,
      serverId: props.serverId,
      message,
    });
    setMessage("");

    var requestOptions: any = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(
      "https://us-central1-beecon-d2a75.cloudfunctions.net/webApi/api/v1/message",
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => {
        console.log(result);
      })
      .catch((error) => console.log("error", error));
  };

  useEffect(() => {
    auth.currentUser?.getIdToken().then((r) => {
      setToken(r);
    });
  }, [auth]);

  useEffect(() => {
    dispatch({ type: "SCROLL_MAIN_REF" });
  }, [messages]);

  return (
    <AuthCheck fallback={<Login />}>
      <S.TitleRow>
        <S.Title data-testid="channel-title">{channel.ChannelName}</S.Title>
      </S.TitleRow>
      <List className={classes.root}>
        {messages.map((m, i) => (
          <ListItem alignItems="flex-start" key={i}>
            <ListItemAvatar>
              <Avatar>{m.userName.slice(0, 1)}</Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={
                <>
                  <Typography
                    component="span"
                    variant="h5"
                    className={classes.inline}
                    color="textPrimary"
                    style={{ marginRight: "20px" }}
                  >
                    {m.userName}
                  </Typography>
                  <Typography
                    component="span"
                    variant="body2"
                    className={classes.inline}
                    color="textPrimary"
                  >
                    {formatRelative(m.timeSent.toDate(), new Date())}
                  </Typography>
                </>
              }
              secondary={
                <Typography
                  component="span"
                  variant="body1"
                  className={classes.inline}
                  color="textPrimary"
                >
                  {m.message}
                </Typography>
              }
            />
          </ListItem>
        ))}
      </List>
      <S.SendMessage>
        <TextField
          inputRef={messageBoxRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
        />
        <Button onClick={sendMessage}>Send</Button>
      </S.SendMessage>
    </AuthCheck>
  );
};

export default Channel;

const S = {
  Title: styled.h1`
    color: #242f40;
  `,
  Subtitle: styled.h5``,
  Message: styled.li`
    padding: 10px;
    display: flex;
    flex-direction: column;
  `,
  TitleRow: styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    position: sticky;
    top: 0px;
    z-index: 1000;
    padding: 0px 20px;
    background-color: #ffbe30;
    > * {
      margin-right: 20px;
    }
  `,
  SendMessage: styled.div`
    position: sticky;
    z-index: 1000;
    background-color: #ffbe30;
    bottom: 0px;
    padding: 10px 20px;
  `,
};
