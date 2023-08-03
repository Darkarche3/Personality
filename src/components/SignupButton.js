import React from "react";

export const SignupButton = () => {
  const click = () => {
    window.location.href = "/signup";
  }
  
  return (
    <button className="button__sign-up" onClick={click} data-testid="signup-button">
      Sign Up
    </button>
  );
};