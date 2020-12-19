//import libraries
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import express from "express";
import * as bodyParser from "body-parser";
import * as uuid from "uuid";
import cors from "cors";
import fetch from "node-fetch";

//initialize firebase inorder to access its services
admin.initializeApp(functions.config().firebase);

//initialize express server
const app = express();
const main = express();

//add the path to receive request and set json as bodyParser to process the body
main.use("/api/v1", app);
app.use(
  cors({
    origin: ["https://beecon.app", "http://localhost:3000"],
  })
);
main.use(bodyParser.json());
main.use(bodyParser.urlencoded({ extended: false }));

//initialize the database and the collection
const db = admin.firestore();

//define google cloud function name
export const webApi = functions.https.onRequest(main);

app.post("/message", async (req, res) => {
  const idToken = req.headers.authorization;

  const user = await admin.auth().verifyIdToken(idToken ?? "");
  if (!user) {
    console.log(`Auth Failed, idToken: ${idToken}`);
    res.status(403).send(`Unable to authenticate user`);
    return;
  }

  if (!req.body?.serverId || typeof req.body?.serverId !== "string") {
    console.log(`Server ID Bad, received ${req.body?.serverId}`);
    res.json({ result: "Server ID not valid" });
    return;
  }
  if (!req.body?.channelId || typeof req.body?.channelId !== "string") {
    console.log(`Channel ID Bad, received ${req.body?.channelId}`);
    res.json({ result: "Channel ID not valid" });
    return;
  }

  const newMessageId = uuid.v4();
  const channelRef = db
    .collection("Server")
    .doc(req.body.serverId)
    .collection("Channel")
    .doc(req.body.channelId);
  const channel = await channelRef.get();
  const channelDiscordUrl = channel.get("discord_webhook_url");

  channelRef
    .collection("Message")
    .doc(newMessageId)
    .set({
      message: req.body.message,
      id: newMessageId,
      timeSent: new Date(),
      userName: user.name,
    })
    .then(() => {
      if (channelDiscordUrl && req.body?.sendToDiscord === true) {
        fetch(channelDiscordUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: user.name,
            avatar_url: user.picture,
            content: req.body.message,
          }),
        });
      }
      res.status(201).send(`Message with ID: ${newMessageId} added.`);
    })
    .catch((e) => {
      res.status(400).send(`Error creating message: ${e}`);
    });
});

app.post("/server", async (req, res) => {
  const idToken = req.headers.authorization;

  const user = await admin.auth().verifyIdToken(idToken ?? "");
  if (!user) {
    console.log(`Auth Failed, idToken: ${idToken}`);
    res.status(403).send(`Unable to authenticate user`);
    return;
  }

  if (!req.body?.serverName || typeof req.body?.serverName !== "string") {
    console.log(`Server Name Bad, received ${req.body?.serverName}`);
    res.json({ result: "Server Name not valid" });
    return;
  }

  const serversRef = db.collection("Server");
  const newServerId = uuid.v4();

  serversRef
    .doc(newServerId)
    .set({ ServerName: req.body.serverName, id: newServerId })
    .then(() => {
      const newChannelId = uuid.v4();
      serversRef.doc(newServerId).collection("Channel").doc(newChannelId).set({
        ChannelName: "General",
        id: newChannelId,
      });
      serversRef.doc(newServerId).collection("User").doc(user.uid).set({
        isAdmin: true,
      });
      db.collection("User")
        .doc(user.uid)
        .set({ servers: admin.firestore.FieldValue.arrayUnion(newServerId) });
    });
});

app.post("/channel", async (req, res) => {
  // verify user exists
  const idToken = req.headers.authorization;
  const user = await admin.auth().verifyIdToken(idToken ?? "");
  if (!user) {
    console.log(`Auth Failed, idToken: ${idToken}`);
    res.status(403).send(`Unable to authenticate user`);
    return;
  }

  // verify props
  if (!req.body?.serverId || typeof req.body?.serverId !== "string") {
    console.log(`Server ID Bad, received ${req.body?.serverId}`);
    res.json({ result: "Server ID not valid" });
    return;
  }
  if (!req.body?.channelName || typeof req.body?.channelName !== "string") {
    console.log(`Channel Name Bad, received ${req.body?.channelName}`);
    res.json({ result: "Channel Name not valid" });
    return;
  }

  // verify user is server Admin
  const serverRef = db.collection("Server").doc(req.body.serverId);
  const serverUser = await serverRef.collection("User").doc(user.uid).get();
  if (!serverUser) {
    console.log(`Channel Name Bad, received ${req.body?.channelName}`);
    res.json({ result: "Channel Name not valid" });
    return;
  }
  if (!serverUser.get("isAdmin")) {
    console.log(`User is not a server admin`);
    res.json({ result: "User is not a server admin" });
    return;
  }

  // create channel
  const channelRef = serverRef.collection("Channel");
  const newChannelId = uuid.v4();
  const newChannelInfo = {
    ChannelName: req.body.channelName,
    id: newChannelId,
    ...(req.body?.discordWebhookUrl && {
      discord_webhook_url: req.body.discordWebhookUrl,
    }),
    ...(req.body?.discordChannelId && {
      discord_channel_id: req.body.discordChannelId,
    }),
  };
  console.log(newChannelInfo);
  channelRef.doc(newChannelId).set(newChannelInfo);
});

export const onUserCreate = functions.auth.user().onCreate((user) => {
  db.collection("User").doc(user.uid).set({ servers: [] });
});
