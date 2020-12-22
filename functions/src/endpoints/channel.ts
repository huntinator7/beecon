import { Response } from "express";
import * as uuid from "uuid";
import { db } from "..";

export const createChannel = async (req: any, res: Response) => {
  const { body } = req;

  // create channel
  const channelRef = db
    .collection("Server")
    .doc(body.serverId)
    .collection("Channel");
  const newChannelId = uuid.v4();
  const newChannelInfo = {
    ChannelName: body.channelName,
    id: newChannelId,
    ...(body?.discordWebhookUrl && {
      discord_webhook_url: body.discordWebhookUrl,
    }),
    ...(body?.discordChannelId && {
      discord_channel_id: body.discordChannelId,
    }),
  };
  console.log(newChannelInfo);
  channelRef.doc(newChannelId).set(newChannelInfo);
};
