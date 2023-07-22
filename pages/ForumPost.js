import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Reply from "../components/Reply";
import Comment from "../components/Comment";
import Navbar from "../components/Navbar";
import {
  fire_posts,
  invalidateComment,
  invalidatePost,
  getPost,
  getComment,
  updatePost
} from "../scripts/FirebaseUtilities";
import { doc, onSnapshot } from "firebase/firestore";

export const ForumPost = (props) => {
  const [post, setPost] = useState({});
  const [postKey, setPostKey] = useState("");
  const [commentArray, setCommentArray] = useState([]);
  const [showReply, setShowReply] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState("");
  let unsubscribe = null;

  useEffect(() => {
    getComment(props.match.params.id, doc => {
      const comment_array = doc2array(doc.data());
      setCommentArray(comment_array);
    });

    getPost(props.match.params.id, document => {
      // Set the state
      setPost(document.data());
      setPostKey(document.id);
      setIsLoading(false);
      // Subscribe to updates of the post
      unsubscribe = onSnapshot(
        doc(fire_posts, props.match.params.id), 
        onPostDocumentUpdate);
    });
  });

  // Keep comments' text and title up to date.
  // This is achieved by having 
  // 1) the onSnapshot subscription above; 
  // 2) comment_array and title in state; 
  // 3) this callback modifying comment_array and title
  const onPostDocumentUpdate = () => {
    // Update comments
    getComment(props.match.params.id, doc => {
      const comment_array = doc2array(doc.data());
      setCommentArray(comment_array);
    });

    // Update post title
    getPost(props.match.params.id, doc => {
      const post = doc.data();
      setPost(post);
    });
  };

  useEffect(() => {
    // Cancels the snapshot listener.
    return () => {
      unsubscribe();
    };
  });

  const toggleCloseCallback = post_key => {
    let oldStatus = post.status;
    let msg =
      oldStatus === "open"
        ? "Do you want to close this post to new answers?"
        : "Do you want to open this post again for new answers?";
    let res = window.confirm(msg);
    if (!res) {
      return;
    }
    const newStatus = oldStatus === "open" ? "closed" : "open";
    updatePost(post_key, { status: newStatus });
  };

  const deleteCallback = (post_key, commentid) => {
    const res = window.confirm("Do you really want to delete the content of this comment?");
    if (!res) {
      return;
    }
    invalidateComment(post_key, commentid);
    if (commentid === "1") {
      // Notice that invalidatePost also closes the post
      invalidatePost(post_key);
    };
  };

  const doc2array = comment_array => {
    var array = [];
    for (const key in comment_array) {
      var out = {};
      out = comment_array[key];
      out["id"] = key;
      array.push(out);
    }
    return array;
  };

  const toggleShowReplyComment = () => {
    setShowReply(!showReply);
  };

  return (
    <div className="container">
      <Navbar />
      <div>
        <div className="panel panel-default">
          <br />
          <div className="panel-heading">
            <Link to="/forum">
              <button className="btn btn-bgn ml-0">
                &lt;&lt; Back to Forum
              </button>
            </Link>
            <br />
            <br />
          </div>
          <div className="panel-body">
            {isLoading && <div className="spinner" />}
            {commentArray.map(comment => (
              <Comment
                key={comment.id}
                comment={comment}
                post_title={post.title}
                post_key={postKey}
                post_status={post.status}
                deleteCallback={deleteCallback}
                toggleCloseCallback={toggleCloseCallback}
              />
            ))}
            <div>
              {!showReply && post.status === "open" && (
                <button
                  onClick={() => toggleShowReplyComment()}
                  className="btn btn-bgn ml-0"
                >
                  Reply
                </button>
              )}
            </div>
          </div>
          <div className="panel-footer" />
        </div>
      </div>
      <br />
      <div>
        {showReply && (
          <Reply
            post_key={props.match.params.id}
            toggleShowReply={() => toggleShowReplyComment()}
          />
        )}
      </div>
    </div>
  );
};