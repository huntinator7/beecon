import { Response } from "express";
import * as admin from "firebase-admin";
import * as uuid from "uuid";
import { db } from "..";

export const createServer = async (req: any, res: Response) => {
  const { body, user } = req;

  const newServerId = uuid.v4();
  const joinCode = uuid.v4();
  try {
    const serverRef = db.collection("Server").doc(newServerId);

    serverRef
      .set({
        ServerName: body.serverName,
        id: newServerId,
        joinCode,
      })
      .then(() => {
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
          .update({
            servers: admin.firestore.FieldValue.arrayUnion(newServerId),
          });
        res.status(201).send(`Server ${body.serverName} created`);
      })
      .catch((e) => {
        res.status(400).send(`Couldn't create server: ${e}`);
      });
  } catch (e) {
    console.error(e);
    res.status(500).json(e);
  }
};

export const joinServerWithCode = async (req: any, res: Response) => {
  const { user, body } = req;

  console.log(user);
  const serverRef = db.collection("Server").doc(body.serverId);
  const server = await serverRef.get();
  const serverJoinCode = server.get("joinCode");
  console.log(serverJoinCode, body.joinCode, body.joinCode === serverJoinCode);
  try {
    if (body.joinCode === serverJoinCode) {
      db.collection("User")
        .doc(body.userId)
        .update({
          servers: admin.firestore.FieldValue.arrayUnion(body.serverId),
        });
      serverRef.collection("User").doc(user.uid).set({
        isAdmin: false,
        uid: user.uid,
      });
      res.status(201).send(`Added you to server ${body.serverId}`);
    }
    res.status(400).send("Couldn't add you to server");
  } catch (e) {
    console.error(e);
    res.status(500).json(e);
  }
};
