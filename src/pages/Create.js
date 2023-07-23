import React from "react";
import { useNavigate } from "react-router-dom";
import { CreatePost } from "./CreatePost";

export const Create = (props) => {
  const push = useNavigate();

  return <CreatePost {...{...props, history: {push}}} />;
};