import React from "react";
import {
  getDateObject,
  getDateTime,
  timeDifference
} from "../scripts/Utilities";
import CommentMenu from "./CommentMenu";

const Comment = (props) => {
  let comment = props.comment;
  let post_title = props.post_title;
  let post_status = props.post_status;
  let post_key = props.post_key;

  const toggleCloseCallback = () => {
    props.toggleCloseCallback(post_key);
  };

  const deleteCallback = () => {
    props.deleteCallback(post_key, comment.id);
  };

  <div align="center">
    <div className="commentpage text-left w-100">
      <div className="p-0" align="left">
        <div id={"edit" + comment.id} className="p-0">
          <table
            id={"post" + comment.id}
            className="tborder w-100 align-middle"
            cellSpacing="0"
            cellPadding="3"
          >
            <thead>
              <tr>
                <th
                  className="thead font-weight-light border border-right-0"
                  title={getDateTime(
                    getDateObject(comment.timestamp)
                  )}
                />
                <th className="thead font-weight-strong border border-left-0">
                  <span className="text-left">
                    {comment.id > 0 && "Re:"}{" "}
                    {post_title}{" "}
                    {post_status === "closed" && "[POST CLOSED]"}
                  </span>
                  {comment.id > 0 && (
                    <span className="float-right">
                      &nbsp; #
                      <a
                        href={"#reply" + comment.id}
                        rel="nofollow"
                        id={"reply" + comment.id}
                        name={comment.id}
                      >
                        <strong>{comment.id}</strong>
                      </a>
                    </span>
                  )}{" "}
                </th>
              </tr>
            </thead>

            <tbody>
              <tr className="align-top">
                <td
                  className={"alt" + ((comment.id % 2) + 1)}
                  width="175"
                >
                  <div id={"postmenu-" + comment.id}>
                    <div className="font-weight-strong">
                      {comment.author ? (
                        <strong>{comment.author}</strong>
                      ) : (
                        <strong>&nbsp;</strong>
                      )}
                    </div>
                  </div>

                  <div className="small text-muted">
                    <br />
                    <div
                      title={getDateTime(
                        getDateObject(comment.timestamp)
                      )}
                    >
                      Posted:
                      {timeDifference(
                        getDateObject(comment.timestamp)
                      )}
                    </div>
                    {+getDateObject(comment.timestamp) !==
                      +getDateObject(comment.lastEdit) && (
                      <div
                        title={getDateTime(
                          getDateObject(comment.lastEdit)
                        )}
                      >
                        Modified:{" "}
                        {timeDifference(
                          getDateObject(comment.lastEdit)
                        )}
                      </div>
                    )}
                  </div>
                </td>

                <td
                  className={
                    "alt" +
                    ((comment.id % 2) + 1) +
                    " border relative"
                  }
                  id={"td-post-" + comment.id}
                >
                  <div
                    className="postRichText"
                    id={"postRichText-" + comment.id}
                    dangerouslySetInnerHTML={{
                      __html: comment.richText
                    }}
                  />
                </td>
              </tr>
                
              <tr>
                <td
                  className={"alt" + ((comment.id % 2) + 1)}
                  width="175"
                />
                <td
                  className={
                    "alt" +
                    ((comment.id % 2) + 1) +
                    " border relative"
                  }
                  id={"td-menu-" + comment.id}
                >
                  <CommentMenu
                    comment_id={comment.id}
                    author={comment.author}
                    post_key={post_key}
                    post_status={post_status}
                    deleteCallback={deleteCallback}
                    toggleCloseCallback={toggleCloseCallback}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <br />      
  </div>
};
export default Comment;