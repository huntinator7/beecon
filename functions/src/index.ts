import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
admin.initializeApp(functions.config().firebase);
import express from "express";
import * as bodyParser from "body-parser";
import cors from "cors";
import { authCheck, propCheck, adminCheck } from "./helpers";
import { joinServerWithCode, createServer } from "./endpoints/server";
import { createChannel } from "./endpoints/channel";
import { createMessage } from "./endpoints/message";

//initialize firebase inorder to access its services

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
app.use(authCheck as any);
main.use(bodyParser.json());
main.use(bodyParser.urlencoded({ extended: false }));

//initialize the database and the collection
export const db = admin.firestore();

//define google cloud function name
export const webApi = functions.https.onRequest(main);

app.use(
  "/message",
  propCheck([
    { field: "serverId", label: "Server ID" },
    { field: "channelId", label: "Channel ID" },
    { field: "message", label: "Message" },
  ]) as any
);
app.post("/message", createMessage);

app.use(
  "/server/create",
  propCheck([{ field: "serverName", label: "Server Name" }]) as any
);
app.post("/server/create", createServer);

app.use(
  "/server/join",
  propCheck([
    { field: "serverId", label: "Server ID" },
    { field: "joinCode", label: "Join Code" },
  ]) as any
);
app.post("/server/join", joinServerWithCode);

app.use(
  "/channel/create",
  propCheck([
    { field: "serverId", label: "Server ID" },
    { field: "channelName", label: "Channel Name" },
  ]) as any
);
app.use("/channel/create", adminCheck as any);
app.post("/channel/create", createChannel);

export const onUserCreate = functions.auth.user().onCreate((user) => {
  db.collection("User").doc(user.uid).set({
    servers: [],
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
  });
});
