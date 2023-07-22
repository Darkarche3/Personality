import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import TextEditor from "../components/Editor/TextEditor";
import {
  User,
  pushComment,
  getPostReference,
  setPostReference
} from "../scripts/FirebaseUtilities";
import { serverTimestamp } from "firebase/firestore";
import { Navbar } from "../components/Navbar";

export const CreatePost = (props) => {
  const [title, setTitle] = useState("");
  const [postKey, setPostKey] = useState("");

  const fire_post = getPostReference();
  const refEditor = useRef();
  const initialRichText = "";

  useEffect(() => {
    // Creates a reference to a new unsaved Post.
    setPostKey(fire_post.id);
  });

  /**
   * Changes the title. 
   * 
   * @param { Event } e
   */
  const onChangeTitle = e => {
    setTitle(e.target.value);
  };

  /**
   * Sends the Post data to Firebase. 
   * 
   * @param { Event } e 
   */
  const onSubmit = e => {
    // Get the rich text (I mean a string with HTML code) from the reference to TextEditor.
    var richText = refEditor.current.valueHtml;
    var plainText = refEditor.current.plainText;

    if (title === "") {
      alert("Title cannot be empty");
      e.preventDefault();
      return;
    }

    if (plainText === "" || richText === "") {
      alert("Text cannot be empty");
      e.preventDefault();
      return;
    }

    // Send to Firebase
    e.preventDefault();
    var author = User().username;
    const timestamp = serverTimestamp();
    const data_post = {
      author: author,
      comments: 1,
      plainText: plainText,
      status: "open",
      title: title,
      lastEdit: timestamp,
      timestamp: timestamp
    };

    const onSuccessfullySetDocument = () => {
      // Get document with all comments, push new comment
      var data_comment = {
        author: author,
        plainText: plainText,
        richText: richText,
        lastEdit: timestamp,
        timestamp: timestamp
      };

      pushComment(postKey, 1, data_comment, () => {
        // Go back to post
        props.history.push("/post/" + postKey);
      });
    };
    setPostReference(fire_post, data_post, onSuccessfullySetDocument);
  };

  return (
    <div className="container">
      <Navbar />
      <div className="panel panel-default">
        <br />
        <div className="panel-heading">
          <h3 className="panel-title">New Post</h3>
        </div>
        <div className="panel-body">
          <form onSubmit={onSubmit}>
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
            <div className="form-group">
              <div className="border border-dark">
                <TextEditor
                  ref={refEditor}
                  post_key={postKey}
                  initialRichText={initialRichText}
                />
              </div>
            </div>
            <div>
              <button type="submit" className="btn btn-bgn">
                Submit
              </button>
              <Link to="/forum" className="btn btn-bgn ml-1">
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};