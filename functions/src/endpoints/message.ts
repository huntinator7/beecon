import { Response } from "express";
import * as admin from "firebase-admin";
import * as uuid from "uuid";
import fetch from "node-fetch";

const db = admin.firestore();

export const createMessage = async (req: any, res: Response) => {
  const { body, user } = req;

  const newMessageId = uuid.v4();
  try {
    const serverRef = db.collection("Server").doc(body.serverId);

    const serverUserRef = serverRef.collection("User").doc(user.uid);
    const serverUser = await serverUserRef.get();
    const suNickName = serverUser.get("nickName");
    const suPicture = serverUser.get("photoURL");

    const channelRef = serverRef.collection("Channel").doc(body.channelId);
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
              username: suNickName || user.name,
              avatar_url: suPicture || user.picture,
              content: body.message,
            }),
          });
        }
        res.status(201).send(`Message with ID: ${newMessageId} added.`);
      })
      .catch((e) => {
        res.status(400).send(`Error creating message: ${e}`);
      });
  } catch (e) {
    console.error(e);
    res.status(500).json(e);
  }
};
