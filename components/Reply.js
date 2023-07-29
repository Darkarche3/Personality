import React, { Component } from "react";
import TextEditor from "./TextEditor/TextEditor";
import {
  User,
  fire_comments,
  getPost,
  updatePost,
  pushComment
} from "../scripts/FirebaseUtilities";
import { serverTimestamp, doc } from "firebase/firestore";

class Reply extends Component {
  state = {
    post: undefined,
    post_key: "",
    comment_key: "",
    richText: "",
    isLoading: false
  };
  fire_comment = doc(fire_comments, this.props.post_key);
  refEditor = React.createRef();
  initialRichText = "<p></p>"; // this is rich text (I mean a string with HTML code)

  componentDidMount() {
    getPost(this.props.post_key, doc => {
      this.setState({
        ...this.state,
        post: doc.data(),
        post_key: doc.id,
        comment_key: doc.data().comments + 1,
        richText: "",
        isLoading: false
      });
    });
  }

  onSubmit = e => {
    e.preventDefault();
    const { comment_key } = this.state;
    var richText = this.refEditor.current.state.valueHtml;
    var plainText = this.refEditor.current.state.plainText;
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

    pushComment(this.props.post_key, comment_key, data);

    // Update number of comments in post collection
    updatePost(
      this.props.post_key,
      { comments: this.state.comment_key },
      () => {
        // Close Reply menu
        this.props.toggleShowReply();
        // Can avoid this refresh with observables but easier to reload the page
        window.location.reload();
      }
    );
  };

  render() {
    let { post_key } = this.state;
    return (
      <div className="panel panel-default">
        <div className="panel-heading" />
        <div className="panel-body">
          <form onSubmit={this.onSubmit}>
            <div className="form-group">
              <div className="border border-dark">
                <TextEditor
                  autoFocus
                  ref={this.refEditor}
                  post_key={post_key}
                  initialRichText={this.initialRichText}
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
                onClick={() => this.props.toggleShowReply()}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default Reply;