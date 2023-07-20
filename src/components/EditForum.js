import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import TextEditor from "./Editor/TextEditor";
import {
  getPost,
  getComment,
  updatePost,
  updateComment
} from "../scripts/FirebaseUtilities";
import { serverTimestamp } from "firebase/firestore";

export const EditForum = (props) => {
  const [title, setTitle] = useState("");
  const [plainText, setPlainText] = useState("");
  const [richText, setRichText] = useState("");
  const [postKey, setPostKey] = useState(props.match.params.postkey);

  const refEditor = useRef();
  const editingPost = props.match.params.commentid === "1";

  useEffect(() => {
    if (editingPost) {
      getPost(props.match.params.postkey, doc => {
        const post = doc.data();
        setTitle(post.title);
      });
    }

    getComment(props.match.params.postkey, doc => {
      setPlainText(doc.data()[props.match.params.commentid].plainText);
      setRichText(doc.data()[props.match.params.commentid].richText);
    });
  });

  /**
   * Changes the title.
   * 
   * @param { Event } e
   */
  const onChangeTitle = e => {
    setTitle(e.target.value);
  }

  /**
   * Handles a submit event.
   * 
   * @param { Event } e 
   */
  const onSubmit = e => {
    // Get the rich text (I mean a string with HTML code) from the reference to TextEditor
    var plainText = refEditor.current.plainText;
    var richText = refEditor.current.valueHtml;
    // Send to Firebase
    e.preventDefault();
    // Get document with all comments, push new comment
    const data_comment = {
      plainText: plainText,
      richText: richText,
      lastEdit: serverTimestamp()
    };
    updateComment(
      props.match.params.postkey,
      props.match.params.commentid,
      data_comment
    );

    if (editingPost) {
      const plainText = refEditor.current.plainText;
      const data_post = {
        plainText: plainText,
        title: title,
        lastEdit: serverTimestamp()
      };
      updatePost(props.match.params.postkey, data_post);
    }
    // Go back to post
    setTitle("");
    setPlainText("");
    setRichText("");

    props.history.push("/post/" + props.match.params.postkey);
  };

  return (
    <div className="container">
      <div className="panel panel-default">
        <br />
        <div className="panel-heading">
          {editingPost && <h3 className="panel-title">Edit Post</h3>}
          {!editingPost && <h3 className="panel-title">Edit Comment</h3>}
        </div>
        <br />
        <div className="panel-body">
          <form onSubmit={onSubmit}>
            {this.editingPost && (
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  name="title"
                  value={title}
                  onChange={onChangeTitle}
                  placeholder="Title"
                />
              </div>
            )}
            <div className="form-group">
              <div className="border border-dark">
                <TextEditor
                  ref={refEditor}
                  post_key={postKey}
                  initialRichText={richText}
                />
              </div>
            </div>
            <div>
              <button type="submit" className="btn btn-bgn">
                Submit
              </button>
              <Link
                to={`/post/${props.match.params.postkey}`}
                className="btn btn-bgn ml-1"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};