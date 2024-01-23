import React, { useState, useEffect } from "react";
import jwt_decode from "jwt-decode";
import { GoogleOAuthProvider, CredentialResponse } from "@react-oauth/google";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { get, post } from "../utilities";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import { socket } from "../client-socket";
import User from "../../../shared/User";
import "../utilities.css";
import NavBar from "./modules/NavBar";
import Add from "./pages/Add";

const GOOGLE_CLIENT_ID = "480391270274-2g6n3lmsb18t38qcem0vco150buo8l3v.apps.googleusercontent.com";

const App = () => {
  const [userId, setUserId] = useState<string | undefined>(undefined);

  useEffect(() => {
    get("/api/whoami")
      .then((user: User) => {
        if (user._id) {
          // They are registed in the database and currently logged in.
          setUserId(user._id);
        }
      })
      .then(() =>
        socket.on("connect", () => {
          post("/api/initsocket", { socketid: socket.id });
        })
      );
  }, []);

  const handleLogin = (credentialResponse: CredentialResponse) => {
    const userToken = credentialResponse.credential;
    const decodedCredential = jwt_decode(userToken as string) as { name: string; email: string };
    console.log(`Logged in as ${decodedCredential.name}`);
    post("/api/login", { token: userToken }).then((user) => {
      setUserId(user._id);
      post("/api/initsocket", { socketid: socket.id });
    });
  };

  const handleLogout = () => {
    setUserId(undefined);
    post("/api/logout");
  };

  // NOTE:
  // All the pages need to have the props extended via RouteComponentProps for @reach/router to work properly. Please use the Skeleton as an example.
  return (
    <>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <NavBar handleLogin={handleLogin} handleLogout={handleLogout} userId={userId} />
        {userId === undefined ? (
          <>Please log in to proceed.</>
        ) : (
          <BrowserRouter>
            <Routes>
              <Route element={<Home />} path="/" />
              <Route element={<Add />} path="/add" />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        )}
      </GoogleOAuthProvider>
    </>
  );
};

export default App;
