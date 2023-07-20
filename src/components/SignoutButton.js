import React from "react";

export const SignoutButton = () => {
  
  const handleSignout = () => {
    sessionStorage.removeItem('user');
    localStorage.removeItem('user');
    localStorage.removeItem('keepLoggedIn');
    window.location = "/";
  }

  return (
    <button className="button__logout" onClick={handleSignout}>
      Sign Out
    </button>
  );
};