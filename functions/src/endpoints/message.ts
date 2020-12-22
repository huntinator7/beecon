import { Response } from "express";
import * as admin from "firebase-admin";
import * as uuid from "uuid";
import fetch from "node-fetch";

const db = admin.firestore();

export const createMessage = async (req: any, res: Response) => {
  const { body, user } = req;

  const newMessageId = uuid.v4();
  const channelRef = db
    .collection("Server")
    .doc(body.serverId)
    .collection("Channel")
    .doc(body.channelId);
  const channel = await channelRef.get();
  const channelDiscordUrl = channel.get("discord_webhook_url");

  channelRef
    .collection("Message")
    .doc(newMessageId)
    .set({
      message: body.message,
      id: newMessageId,
      timeSent: new Date(),
      userName: user.name,
    })
    .then(() => {
      if (channelDiscordUrl && body?.sendToDiscord === true) {
        fetch(channelDiscordUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: user.name,
            avatar_url: user.picture,
            content: body.message,
          }),
        });
      }
      res.status(201).send(`Message with ID: ${newMessageId} added.`);
    })
    .catch((e) => {
      res.status(400).send(`Error creating message: ${e}`);
    });
};
