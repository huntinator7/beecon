import { https } from "firebase-functions";
import gqlServer from "./graphql/server";

const server = gqlServer();

// Graphql api
// https://us-central1-beecon-d2a75.cloudfunctions.net/api/
const api = https.onRequest(server);

export { api };
