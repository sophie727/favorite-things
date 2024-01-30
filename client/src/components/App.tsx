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
import Profile from "./pages/Profile";
import ProfileEdit from "./pages/ProfileEdit";
import Help from "./pages/Help";
import Community from "./pages/Community";

const GOOGLE_CLIENT_ID = "480391270274-2g6n3lmsb18t38qcem0vco150buo8l3v.apps.googleusercontent.com";

const App = () => {
  const [tagOptions, setTagOptions] = useState([""]);
  const [userId, setUserId] = useState<string | undefined>(undefined);
  const [currID, setCurrID] = useState("");

  const setID = (user_id: string) => {
    const urlParams = new URLSearchParams(window.location.search);
    const curr_id = urlParams.get("user");
    if (curr_id === null) {
      console.log("setting curr_id to", user_id);
      setCurrID(user_id);
      get("/api/tags", { curr_id: user_id }).then((tags: string[]) => {
        setTagOptions([""].concat(tags));
      });
    } else {
      console.log("setting curr_id to", curr_id);
      setCurrID(curr_id);
      get("/api/tags", { curr_id: curr_id }).then((tags: string[]) => {
        setTagOptions([""].concat(tags));
      });
    }
  };

  useEffect(() => {
    get("/api/whoami")
      .then((user: User) => {
        if (user._id) {
          // They are registed in the database and currently logged in.
          setUserId(user._id);
          setID(user._id);
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
    const decodedCredential = jwt_decode(userToken as string) as {
      name: string;
      email: string;
    };
    console.log(`Logged in as ${decodedCredential.name}`);
    post("/api/login", { token: userToken }).then((user) => {
      setUserId(user._id);
      setID(user._id);
      post("/api/initsocket", { socketid: socket.id });
    });
  };

  const handleLogout = () => {
    setUserId(undefined);
    post("/api/logout");
  };

  const addTag = (newTag: { tag: string; _id: string; user_id: string }) => {
    console.log("got addTag", newTag);
    setCurrID((id) => {
      if (id === newTag.user_id) {
        console.log("setting tag options");
        setTagOptions((prevTagOptions) => {
          for (const tag of prevTagOptions) {
            if (newTag.tag === tag) {
              return prevTagOptions;
            }
          }
          return prevTagOptions.concat([newTag.tag]);
        });
      }
      return id;
    });
  };

  useEffect(() => {
    socket.on("newTag", addTag);
    return () => {
      socket.off("newTag", addTag);
    };
  }, []);

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
              <Route
                element={
                  <Home
                    tagOptions={tagOptions}
                    userId={userId}
                    currID={currID}
                    setCurrID={setCurrID}
                  />
                }
                path="/"
              />
              <Route
                element={<Add tagOptions={tagOptions} setTagOptions={setTagOptions} />}
                path="/add"
              />
              <Route
                element={<Profile userId={userId} currID={currID} setCurrID={setCurrID} />}
                path="/profile"
              />
              <Route element={<ProfileEdit userId={userId} />} path="/profile/edit" />
              <Route element={<Help />} path="/help" />
              <Route element={<Community userId={userId} />} path="/community" />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        )}
      </GoogleOAuthProvider>
    </>
  );
};

export default App;
