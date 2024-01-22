import React, { useState, useEffect } from "react";
import jwt_decode from "jwt-decode";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { get, post } from "../utilities";
import { socket } from "../client-socket";
import User from "../../../shared/User";
import "../utilities.css";
import "./NavBar.css";
import {
  GoogleOAuthProvider,
  GoogleLogin,
  googleLogout,
  CredentialResponse,
} from "@react-oauth/google";

const GOOGLE_CLIENT_ID = "480391270274-2g6n3lmsb18t38qcem0vco150buo8l3v.apps.googleusercontent.com";

type Props = {
  userId?: string;
  handleLogin: (credentialResponse: CredentialResponse) => void;
  handleLogout: () => void;
};

const NavBar = (props: Props) => {
  const { handleLogin, handleLogout } = props;

  return (
    <nav className="NavBar">
      <span className="NavBarItem">Menu button</span>
      <span className="NavBarItem">My Favorite Things</span>
      <span className="NavBarItem">
        {props.userId ? (
          <button
            onClick={() => {
              googleLogout();
              handleLogout();
            }}
          >
            Logout
          </button>
        ) : (
          <GoogleLogin onSuccess={handleLogin} onError={() => console.log("Error Logging in")} />
        )}
      </span>
    </nav>
  );
};

export default NavBar;
