import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { EditForum } from "./EditForum";

export const Edit = (props) => {
  const params = useParams();
  const push = useNavigate();

  return <EditForum {...{...props, match: {params}, history: {push}}} />;
};