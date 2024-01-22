import React from "react";
import { GoogleOAuthProvider, CredentialResponse } from "@react-oauth/google";

import "./Skeleton.css";
import NavBar from "../NavBar";

const GOOGLE_CLIENT_ID = "480391270274-2g6n3lmsb18t38qcem0vco150buo8l3v.apps.googleusercontent.com";

type Props = {
  userId?: string;
  handleLogin: (credentialResponse: CredentialResponse) => void;
  handleLogout: () => void;
};
const Skeleton = (props: Props) => {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <NavBar
        handleLogin={props.handleLogin}
        userId={props.userId}
        handleLogout={props.handleLogout}
      />
    </GoogleOAuthProvider>
  );
};

export default Skeleton;
