import { https } from "firebase-functions";
import admin from "firebase-admin";
import * as uuid from "uuid";
import cors from "cors";

const corsHandler = cors({ origin: true });

const addMessage = https.onRequest(async (req, res) => {
  //   const user = await admin.auth().verifyIdToken(req.body.token);
  //   if (!user) {
  //       res.json()
  //   }
  corsHandler(req, res, () => {
    if (!req.body?.serverId || typeof req.body?.serverId !== "string") {
      res.json({ result: "Server ID not valid" });
      return;
    }
    if (!req.body?.channelId || typeof req.body?.channelId !== "string") {
      res.json({ result: "Channel ID not valid" });
      return;
    }
    const newMessageId = uuid.v4();
    admin
      .firestore()
      .collection("Server")
      .doc(req.body.serverId)
      .collection("Channel")
      .doc(req.body.channelId)
      .collection("Message")
      .doc(newMessageId)
      .set({
        message: req.body.message,
        id: newMessageId,
        timeSent: new Date(),
        userName: req.body.displayName,
      })
      .then(() => {
        res.json({ result: `Message with ID: ${newMessageId} added.` });
      })
      .catch(() => {
        res.json({ result: "Error creating message" });
      });
  });
});

export { addMessage };
