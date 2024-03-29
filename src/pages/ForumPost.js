import React, { Component } from "react";
import { Link } from "react-router-dom";
import Reply from "../components/Reply";
import Comment from "../components/Comment";
import {
  fire_posts,
  invalidateComment,
  invalidatePost,
  getPost,
  getComment,
  updatePost
} from "../scripts/FirebaseUtilities";
import { doc, onSnapshot } from "firebase/firestore";

export class ForumPost extends Component {
  state = {
    post: {},
    post_key: "",
    comment_array: [],
    showReply: false,
    isLoading: true,
    title: ""
  };
  unsubscribe = () => { return; };

  componentDidMount() {
    getComment(this.props.match.params.id, doc => {
      const comment_array = this.doc2array(doc.data());
      this.setState({ ...this.state, comment_array: comment_array });
    });
    getPost(this.props.match.params.id, docu => {
      // Set the state
      var data = {
        post: docu.data(),
        post_key: docu.id,
        isLoading: false
      };
      this.setState({ ...this.state, ...data });
      // Subscribe to updates of the post
      this.unsubscribe = onSnapshot(
        doc(fire_posts, this.props.match.params.id), 
        this.onPostDocumentUpdate);
    });
  }

  // Keep comments' text and title up to date.
  // This is achieved by having 
  // 1) the onSnapshot subscription above; 
  // 2) comment_array and title in state; 
  // 3) this callback modifying comment_array and title
  onPostDocumentUpdate = () => {
    // Update comments
    getComment(this.props.match.params.id, doc => {
      const comment_array = this.doc2array(doc.data());
      this.setState({ ...this.state, comment_array: comment_array });
    });
    // Update post title
    getPost(this.props.match.params.id, doc => {
      const post = doc.data();
      this.setState({ ...this.state.post, post: post });
    });
  };

  componentWillUnmount() {
    this.unsubscribe();
  }

  toggleCloseCallback = post_key => {
    let oldStatus = this.state.post.status;
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

  deleteCallback = (post_key, commentid) => {
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

  doc2array(comment_array) {
    var array = [];
    for (const key in comment_array) {
      var out = {};
      out = comment_array[key];
      out["id"] = key;
      array.push(out);
    }
    return array;
  }

  reply(id) {
    this.toggleShowReplyComment();
  }

  toggleShowReplyComment() {
    this.setState({ ...this.state, showReply: !this.state.showReply });
  }

  render() {
    const { isLoading, comment_array, post, post_key, key, showReply } = this.state;
    return (
      <div>
        <div className="container">
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
                {comment_array.map(comment => (
                  <Comment
                    key={comment.id}
                    comment={comment}
                    post_title={post.title}
                    post_key={post_key}
                    post_status={post.status}
                    deleteCallback={this.deleteCallback}
                    toggleCloseCallback={this.toggleCloseCallback}
                  />
                ))}
                <div>
                  {!showReply && post.status === "open" && (
                    <button
                      onClick={() => this.reply(key)}
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
                post_key={this.props.match.params.id}
                toggleShowReply={() => this.toggleShowReplyComment()}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}