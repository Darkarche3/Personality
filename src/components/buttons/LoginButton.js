import React from "react";

export const LoginButton = () => {
  const click = () => {
    window.location.href = "../login";
  }
  return (
    <button className="button__login" onClick={click}>
      Log In
    </button>
  );
};