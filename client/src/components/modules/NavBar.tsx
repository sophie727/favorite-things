import React, { useState, useEffect } from "react";
import "../../utilities.css";
import "./NavBar.css";
import {
  GoogleLogin,
  googleLogout,
  CredentialResponse,
} from "@react-oauth/google";

type Props = {
  userId?: string;
  handleLogin: (credentialResponse: CredentialResponse) => void;
  handleLogout: () => void;
};

const NavBar = (props: Props) => {
  const { handleLogin, handleLogout } = props;
  return (
    <>
      <nav className="NavBar">
        <div className="NavBarMenu">
          <button className="NavBarItem NavBarMenuButton">
            <hr className="NavBarMenuLine"></hr>
            <hr className="NavBarMenuLine"></hr>
            <hr className="NavBarMenuLine"></hr>
          </button>
          <div className="NavBarMenuDropdown">
            <a href="/"> Home</a>
            <a href="/add"> Add Page</a>
          </div>
        </div>
        <a className="NavBarItem NavBarTitle" href="/">
          My Favorite Things
        </a>
        <div className="NavBarItem NavBarGoogleAuth">
          {props.userId ? (
            <button
              className="button"
              onClick={() => {
                googleLogout();
                handleLogout();
              }}
            >
              Logout
            </button>
          ) : (
            <GoogleLogin
              onSuccess={handleLogin}
              onError={() => console.log("Error Logging in")}
            />
          )}
        </div>
      </nav>
    </>
  );
};

export default NavBar;
