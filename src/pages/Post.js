import React from "react";
import { useParams } from "react-router-dom";
import { ForumPost } from "./ForumPost";

export const Post = (props) => {
  const params = useParams();

  return <ForumPost {...{...props, match: {params}}} />;
};