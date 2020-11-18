import React, { FunctionComponent, useEffect, useRef, useState } from "react";
import { RouteComponentProps } from "@reach/router";
import * as uuid from "uuid";
import {
  useFirestore,
  useFirestoreCollectionData,
  useFirestoreDocData,
} from "reactfire";
import styled from "styled-components";
import {
  Avatar,
  Button,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  makeStyles,
  TextField,
  Typography,
} from "@material-ui/core";
import { formatRelative } from "date-fns";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "75%",
    backgroundColor: theme.palette.background.paper,
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
  const classes = useStyles();

  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const messageBoxRef: any = useRef();

  const serverRef = useFirestore().collection("Server").doc(props.serverId);
  const channelRef = serverRef.collection("Channel").doc(props.channelId);
  const messagesRef = channelRef.collection("Message");
  const server = useFirestoreDocData(serverRef);
  const channel: any = useFirestoreDocData(channelRef);
  const messages: any[] = useFirestoreCollectionData(
    messagesRef.orderBy("timeSent")
  );

  const sendMessage = () => {
    if (!message) return;
    const newMessageId = uuid.v4();
    messagesRef
      .doc(newMessageId)
      .set({
        message,
        id: newMessageId,
        timeSent: new Date(),
        userName: name,
      })
      .then(() => {
        setMessage("");
        messageBoxRef.current.focus();
      });
  };

  useEffect(() => {
    console.log(server);
    console.log(channel);
    console.log(messages);
  }, [server, channel, messages]);

  return (
    <>
      <S.TitleRow>
        <S.Title data-testid="channel-title">{channel.ChannelName}</S.Title>
        <TextField
          label="Name to Use"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </S.TitleRow>
      <List className={classes.root}>
        {messages.map((m) => (
          <ListItem alignItems="flex-start">
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
      <div>
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
      </div>
    </>
  );
};

export default Channel;

const S = {
  Title: styled.h1``,
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
    background-color: white;
    > * {
      margin-right: 20px;
    }
  `,
};
