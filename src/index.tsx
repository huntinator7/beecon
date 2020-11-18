import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { Routes } from "./router";
import { StoreProvider } from "./store";
import { FirebaseAppProvider } from "reactfire";

const firebaseConfig = {
  apiKey: "AIzaSyB0ZXhFmdsacmzs8BDNJYB07Ii-xhdubjk",
  authDomain: "beecon-d2a75.firebaseapp.com",
  databaseURL: "https://beecon-d2a75.firebaseio.com",
  projectId: "beecon-d2a75",
  storageBucket: "beecon-d2a75.appspot.com",
  messagingSenderId: "631889261445",
  appId: "1:631889261445:web:e06bfde0134faddd3ccaec",
  measurementId: "G-NDH8CJRKQB",
};

// @ts-ignore
ReactDOM.unstable_createRoot(
  document.getElementById("root") as HTMLElement
).render(
  <React.StrictMode>
    <FirebaseAppProvider firebaseConfig={firebaseConfig}>
      <StoreProvider>
        <Routes />
      </StoreProvider>
    </FirebaseAppProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
