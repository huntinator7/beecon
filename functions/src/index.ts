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
