import React from "react";
import { User } from "../scripts/FirebaseUtilities";
import { Link } from "react-router-dom";

const CommentMenu = (props) => {
  let post_key = props.post_key;
  let comment_id = props.comment_id;
  let post_status = props.post_status;

  const toggleClose = () => {
    props.toggleCloseCallback();
  };

  const _delete = () => {
    props.deleteCallback();
  };

  return (
    props.author === User().username && (
      <div className="postmenu small text-muted bottom-right">
        <Link
          to={"/edit/" + post_key + "/" + comment_id}
        >
          edit
        </Link>

        <span>&nbsp;&nbsp;</span>

        {comment_id === "1" && post_status === "open" && (
          <span>
            <button
              type="button"
              className="link-button"
              title="When closed no answer can be posted"
              onClick={() => toggleClose()}
            >
              close
            </button>
            <span>&nbsp;&nbsp;</span>
          </span>
        )}

        {comment_id === "1" &&
          post_status === "closed" && (
            <span>
              <button
                type="button"
                className="link-button"
                title="Open this post again to new answers"
                onClick={() => toggleClose()}
              >
                open
              </button>
              <span>&nbsp;&nbsp;</span>
            </span>
          )}
        <button
          type="button"
          className="link-button"
          title="Delete the content of this comment/post"
          onClick={() => _delete()}
        >
          delete
        </button>
      </div>
    )
  );
};
export default CommentMenu;