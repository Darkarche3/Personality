import React, { useState, useRef, useEffect } from "react";
import TextEditor from "./Editor/TextEditor";
import {
  User,
  fire_comments,
  getPost,
  updatePost,
  pushComment
} from "../scripts/FirebaseUtilities";
import { serverTimestamp, doc } from "firebase/firestore";

const Reply = (props) => {
  const [post, setPost] = useState(undefined);
  const [postKey, setPostKey] = useState("");
  const [commentKey, setCommentKey] = useState("");
  const [richText, setRichText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fire_comment = doc(fire_comments, props.post_key);
  const refEditor = useRef();
  const initialRichText = "<p></p>"; // this is rich text (I mean a string with HTML code)

  useEffect(() => {
    getPost(props.post_key, doc => {
      setPost(doc.data());
      setPostKey(doc.id);
      setCommentKey(doc.data().comments + 1);
      setRichText("");
      setIsLoading(false);
    });
  });

  /**
   * Handles a submit event.
   * 
   * @param { Event } e 
   */
  const onSubmit = e => {
    e.preventDefault();
    var richText = refEditor.current.valueHtml;
    var plainText = refEditor.current.plainText;
    if (plainText === "" || richText === "") {
      alert("Text cannot be empty");
      e.preventDefault();
      return;
    }
    const timestamp = serverTimestamp();
    var data = {
      author: User().username,
      plainText: plainText,
      richText: richText,
      lastEdit: timestamp,
      timestamp: timestamp
    };

    pushComment(props.post_key, commentKey, data);

    // Update number of comments in post collection
    updatePost(
      props.post_key,
      { comments: commentKey },
      () => {
        // Close Reply menu
        props.toggleShowReply();
        // Can avoid this refresh with observables but easier to reload the page
        window.location.reload();
      }
    );
  };

  return (
    <div className="panel panel-default">
      <div className="panel-heading" />
      <div className="panel-body">
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <div className="border border-dark">
              <TextEditor
                autoFocus
                ref={refEditor}
                post_key={postKey}
                initialRichText={initialRichText}
                height="10em"
              />
            </div>
          </div>
          <div>
            <button type="submit" className="btn btn-bgn">
              Submit
            </button>
            <button
              type="submit"
              className="btn btn-bgn ml-1"
              onClick={() => props.toggleShowReply()}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default Reply;