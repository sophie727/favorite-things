import React, { useState, useEffect } from "react";
import "../../utilities.css";
import "./NavBar.css";
import { GoogleLogin, googleLogout, CredentialResponse } from "@react-oauth/google";

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
