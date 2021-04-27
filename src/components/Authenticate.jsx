import React, { useState } from "react";
import SignIn from "./authentication components/SignIn.jsx";
import SignUp from "./authentication components/SignUp.jsx";

const Authenticate = (props) => {
  const [authType, setAuthType] = useState("sign-in");

  const handleAuthType = () => {
    return authType === "sign-in"
      ? setAuthType("sign-up")
      : setAuthType("sign-in");
  };

  const myAuthType =
    authType === "sign-in" ? (
      <SignIn key={1} handleAuthType={handleAuthType} />
    ) : (
      <SignUp key={2} handleAuthType={handleAuthType} />
    );

  return <React.Fragment>{myAuthType}</React.Fragment>;
};

export default Authenticate;
