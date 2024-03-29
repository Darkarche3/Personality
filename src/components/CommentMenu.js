import React, { Component } from "react";
import { User } from "../scripts/FirebaseUtilities";
import { Link } from "react-router-dom";
import "../styles/CommentMenu.css"

export default class CommentMenu extends Component {
  toggleClose() {
    this.props.toggleCloseCallback();
  }

  delete() {
    this.props.deleteCallback();
  }

  render() {
    let post_key = this.props.post_key;
    let comment_id = this.props.comment_id;
    let post_status = this.props.post_status;

    return (
      this.props.author === User().username && (
        <div className="postmenu small text-muted bottom-right">
          <Link
            to={"/edit/" + post_key + "/" + this.props.comment_id} className="edit"
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
                onClick={() => this.toggleClose()}
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
                  onClick={() => this.toggleClose()}
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
            onClick={() => this.delete()}
          >
            delete
          </button>
        </div>
      )
    );
  }
}