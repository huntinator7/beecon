import { Response } from "express";
import * as admin from "firebase-admin";
import * as uuid from "uuid";
import { db } from "..";

export const createServer = async (req: any, res: Response) => {
  const { body, user } = req;

  const newServerId = uuid.v4();
  const serverRef = db.collection("Server").doc(newServerId);

  serverRef.set({ ServerName: body.serverName, id: newServerId }).then(() => {
    const newChannelId = uuid.v4();
    serverRef.collection("Channel").doc(newChannelId).set({
      ChannelName: "General",
      id: newChannelId,
    });
    serverRef.collection("User").doc(user.uid).set({
      isAdmin: true,
      uid: user.uid,
    });
    db.collection("User")
      .doc(user.uid)
      .set({ servers: admin.firestore.FieldValue.arrayUnion(newServerId) });
  });
};

export const joinServerWithCode = async (req: any, res: Response) => {
  const { body } = req;

  db.collection("Server")
    .doc(body.serverId)
    .collection("User")
    .doc(body.userId)
    .set({ isAdmin: false, uid: body.userId });

  db.collection("User")
    .doc(body.userId)
    .set({ servers: admin.firestore.FieldValue.arrayUnion(body.serverId) });
};
