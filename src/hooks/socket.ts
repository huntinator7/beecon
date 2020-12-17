import { useEffect } from "react";
import { io } from "socket.io-client/build/index";

let socket: any;

export const initiateSocket = (room: any) => {
  socket = io("https://beecon-discord-bot-pgxownozfa-uc.a.run.app");
  console.log(`Connecting socket...`);
  if (socket && room) socket.emit("join", room);
};

export const disconnectSocket = () => {
  console.log("Disconnecting socket...");
  if (socket) socket.disconnect();
};

export const subscribeToChat = (cb: any) => {
  if (!socket) return true;
  socket.on("newMessages", (msg: any) => {
    console.log("Getting 10 messages");
    const msgs = msg.map((m: any) => ({
      ...m,
      timeSent: new Date(m.timeSent),
    }));
    console.log(msgs);
    return cb(null, "newMessages", msgs);
  });
  socket.on("message", (msg: any) => {
    console.log(msg);
    console.log("Message received");
    const cleanMsg = { ...msg, timeSent: new Date(msg.timeSent) };
    console.log(cleanMsg);
    return cb(null, "message", cleanMsg);
  });
};

export const sendMessage = (room: any, message: any) => {
  if (socket) socket.emit("chat", { message, room });
};

export const useSocket = (
  server: string,
  channel: string,
  addMessage: (msg: any) => void,
  setMessages: (msg: any[]) => void
) => {
  const room = `${server}.${channel}`;
  useEffect(() => {
    if (room) initiateSocket(room);
    subscribeToChat((err: any, type: string, data: any) => {
      if (err) return;
      console.log("NEW DISCORD MESSAGE", type, data, room);
      switch (type) {
        case "message":
          addMessage(data);
          break;
        case "newMessages":
          console.log("ARE WE FUCKING HERE YET");
          setMessages(data);
          break;
        default:
          break;
      }
    });
    return () => {
      disconnectSocket();
    };
  }, [server, channel]);

  useEffect(() => {
    "INIT";
  }, []);

  return {
    sendSocketMessage: (message: any) => sendMessage(room, message),
  };
};
