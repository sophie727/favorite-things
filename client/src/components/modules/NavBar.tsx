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
  const createMenu = () => {
    var popup = document.getElementById("MenuPopup");
    popup?.classList.toggle("show");
  };
  return (
    <>
      <nav className="NavBar">
        <button className="NavBarItem NavBarMenu" onClick={createMenu}>
          <hr className="NavBarMenuLine"></hr>
          <hr className="NavBarMenuLine"></hr>
          <hr className="NavBarMenuLine"></hr>
        </button>
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
