import { Request, Response } from "express";
import * as admin from "firebase-admin";
import { db } from ".";

export interface ReqWithUser extends Request<any> {
  user: admin.auth.DecodedIdToken;
}

export const authCheck = (
  req: ReqWithUser,
  res: Response<any>,
  next: () => void
) => {
  const idToken = req.headers.authorization;
  admin
    .auth()
    .verifyIdToken(idToken ?? "")
    .then((user) => {
      req.user = user;
      next();
    })
    .catch(() => {
      res.status(401).send(`Unable to authenticate user`);
    });
};

export const propCheck = (props: { field: string; label: string }[]) => (
  req: ReqWithUser,
  res: Response<any>,
  next: () => void
) => {
  const go = props.every(({ field, label }) => {
    if (!req.body?.[field] || typeof req.body?.[field] !== "string") {
      console.log(`${label} Bad, received ${req.body?.[field]}`);
      res.json({ result: `${label} not valid` });
      return false;
    }
    return true;
  });
  if (go) {
    next();
  }
};

export const adminCheck = async (
  req: ReqWithUser,
  res: Response<any>,
  next: () => void
) => {
  const serverRef = db.collection("Server").doc(req.body.serverId);
  const serverUser = await serverRef.collection("User").doc(req.user.uid).get();
  if (!serverUser) {
    console.log("User not found in server");
    res.status(403).json({ result: "User not found in server" });
    return;
  }
  if (!serverUser.get("isAdmin")) {
    console.log(`User is not a server admin`);
    res.status(403).json({ result: "User is not a server admin" });
    return;
  }
  next();
};
