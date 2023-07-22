import React from "react";
import { Navbar } from "../components/Navbar";
import { User } from "../scripts/FirebaseUtilities";

export const Profile = () => {
  return (
    <div className="page-layout">
      <Navbar />
      <div className="page-layout__content" />
    </div>
  );
};