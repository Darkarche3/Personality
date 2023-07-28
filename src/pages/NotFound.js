import React from "react";
import { Navbar } from "../components/Navbar";

export const NotFound = () => {
  return (
    <div className="page-layout">
      <Navbar />
      404 Error! Page not found!
      <div className="page-layout__content" />
    </div>
  );
};