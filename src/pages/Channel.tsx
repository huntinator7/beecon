import React, {
  FunctionComponent,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { RouteComponentProps } from "@reach/router";
import {
  AuthCheck,
  useAuth,
  useFirestore,
  useFirestoreCollectionData,
  useFirestoreDocData,
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
import { useSocket } from "../hooks/socket";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    backgroundColor: "#dddfe4",
    minHeight: "100vh",
  },
  inline: {
    display: "inline",
    whiteSpace: "pre-wrap",
  },
}));

interface Props extends RouteComponentProps {
  serverId?: string;
  channelId?: string;
}

const Channel: FunctionComponent<Props> = (props) => {
  const auth = useAuth();

  const { dispatch } = useContext(StoreContext);

  const classes = useStyles();

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [discMessages, setDiscMessages] = useState<any[]>([]);
  const [dm, sdm] = useState<any[]>([]);
  const addNewDiscMsg = useCallback(
    (newMsg: any) => {
      console.log("IN ADD NEW DISC");
      setDiscMessages([...discMessages, newMsg]);
    },
    [discMessages]
  );
  const cleanSetDiscMsgs = (newMsgs: any) => {
    console.log("IN CLEAN SET DISC");
    console.log(discMessages);
    console.log(newMsgs);
    setDiscMessages(newMsgs);
    sdm(newMsgs.slice(0, -1));
    console.log(discMessages);
  };
  const [fbCleanMessages, setFbCleanMessages] = useState<any[]>([]);
  const [sendToDiscord, setSendToDiscord] = useState(true);

  const messageBoxRef: any = useRef();

  const serverRef = useFirestore().collection("Server").doc(props.serverId);
  const channelRef = serverRef.collection("Channel").doc(props.channelId);
  const messagesRef = channelRef.collection("Message");

  const { sendSocketMessage } = useSocket(
    props.serverId ?? "testing",
    props.channelId ?? "testing",
    addNewDiscMsg,
    cleanSetDiscMsgs
  );

  const channel: any = useFirestoreDocData(channelRef);
  const fbMessages: any[] = useFirestoreCollectionData(
    messagesRef.orderBy("timeSent").limitToLast(50)
  );

  const sendMessage = async () => {
    if (!message) return;
    const token = await auth.currentUser?.getIdToken();
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", token ?? "");
    myHeaders.append("Cache-Control", "no-cache");

    var body = JSON.stringify({
      channelId: props.channelId,
      serverId: props.serverId,
      message,
      sendToDiscord,
    });
    setMessage("");

    var requestOptions: any = {
      method: "POST",
      headers: myHeaders,
      body,
      redirect: "follow",
    };

    fetch(
      "https://us-central1-beecon-d2a75.cloudfunctions.net/webApi/api/v1/message",
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => {
        console.log(result);
        sendSocketMessage(message);
      })
      .catch((error) => console.log("error", error));
  };

  useEffect(() => {
    const s = [...fbCleanMessages, ...dm]
      .filter((m) => !!m)
      .sort((a, b) => (a.timeSent < b.timeSent ? -1 : 1));
    console.log(s);
    setMessages(s);
  }, [fbCleanMessages, dm]);

  useEffect(() => {
    sdm([...dm, discMessages.pop()]);
  }, [discMessages]);

  useEffect(() => {
    console.log("DISC: ", discMessages);
    console.log("dm: ", dm);
  }, [discMessages, dm]);

  useEffect(() => {
    setFbCleanMessages(
      fbMessages.map((m) => ({
        ...m,
        timeSent: m.timeSent.toDate(),
      }))
    );
  }, [fbMessages]);

  useEffect(() => {
    dispatch({ type: "SCROLL_MAIN_REF" });
  }, [dispatch, messages]);

  return (
    <AuthCheck fallback={<Login />}>
      <S.Container>
        <S.TitleRow>
          <S.Title data-testid="channel-title">{channel.ChannelName}</S.Title>
          <label>Send to Discord</label>
          <input
            type="checkbox"
            checked={sendToDiscord}
            onChange={(e) => setSendToDiscord(!sendToDiscord)}
          />
        </S.TitleRow>
        <List className={classes.root}>
          {messages.map((m, i) => (
            <ListItem alignItems="flex-start" key={i}>
              <ListItemAvatar>
                {m?.avatar ? (
                  <Avatar src={m.avatar} />
                ) : (
                  <Avatar>{m.userName.slice(0, 1)}</Avatar>
                )}
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
                      {formatRelative(m.timeSent, new Date())}
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
            multiline
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
            }}
            onKeyUp={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                sendMessage();
                e.preventDefault();
              }
            }}
            style={{ flexGrow: 1 }}
          />
          <Button onClick={sendMessage}>Send</Button>
        </S.SendMessage>
      </S.Container>
    </AuthCheck>
  );
};

export default Channel;

const S = {
  Container: styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    justify-self: center;
    h1,
    h2,
    h3 {
      text-align: center;
    }
  `,
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
    display: flex;
  `,
};
