import { fs, storage } from "../Firebase";
import { 
  CollectionReference, 
  DocumentReference, 
  collection, 
  getDoc, 
  getDocs, 
  doc, 
  setDoc, 
  updateDoc, 
  serverTimestamp 
} from "firebase/firestore";

/**
 * Store a file to a path in the Firebase Storage.
 *
 * @param { String } storagePath - Path in Firebase storage where the file gets stored, e.g. the post_key.
 * @param { File } file - The file as a File object.
 * @param { UploadMetadata } metadata - Metadata for the newly uploaded object.
 * @callback [onUploadProgress] - Callback on upload progress triggering when the file is being uploading.
 * @callback [onSuccessfulUpload] - Callback on the file URL triggering when the file is successfully uploaded.
 * @callback [onError] - Callback on error message and object triggering when the upload encounters an error.
 */
export const uploadToStorage = (
  storagePath,
  file,
  metadata = {},
  onUploadProgress = p => {},
  onSuccessfulUpload = (msg, url) => {},
  onError = err => {}
) => {
  var ref = storage.ref(storagePath).child(file.name);

  var uploadTask = ref.put(file, metadata);

  // Register three observers:
  // 1. 'state_changed' observer, called any time the state changes
  // 2. Error observer, called on failure
  // 3. Completion observer, called on successful completion

  uploadTask.on(
    "state_changed",
    snapshot => {
      // Observe state change events such as progress, pause, and resume.
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded.
      var uploadProgress =
        (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

      onUploadProgress(uploadProgress);

      switch (snapshot.state) {
        case "paused":
          console.log("Upload is paused");
          break;
        case "running":
          break;
        default:
          break;
      }
    },
    error => {
      // A full list of error codes is available at
      // https://firebase.google.com/docs/storage/web/handle-errors
      let msg = "";

      switch (error.code) {
        case "storage/unauthorized":
          msg =
            error.code +
            " error: user does not have permission to access the object. Make sure the size fo the file is less than 1MB";
          break;
        case "storage/canceled":
          msg = error.code + " error: user canceled the upload";
          break;
        case "storage/unknown":
          msg =
            error.code +
            " error: unknown error occurred, inspect error.serverResponse";
          break;
        default:
          msg =
            error.code +
            " error: unknown error occurred, inspect error.serverResponse";
          break;
      }

      onError(msg, error);

      // Unsubscribe after error
      uploadTask();
    },
    complete => {
      // Handle successful uploads on complete
      // For instance, get the download URL: https://firebasestorage.googleapis.com/...
      uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
        onSuccessfulUpload(downloadURL);
      });

      // Unsubscribe after complete
      uploadTask();
    }
  );

  return uploadTask;
};

/**
 * Provides the user currently logged in, if any.
 * 
 * @returns { Object } - the user currently logged in, if any.
 */
export const User = () => {
  var user = null;

  if (localStorage.getItem("keepLoggedIn") === "yes") {
    user = JSON.parse(localStorage.getItem('user'));
  } else {
    user = JSON.parse(sessionStorage.getItem('user'));
  }

  return user;
};

/**
 * Checks if current user is an admin.
 * 
 * @returns { Boolean }
 */
export const isAdmin = () => {
  if (User() == null) {
    return false;
  }

  return User().username === "admin";
};

/**
 * Gets the posts collection.
 * @type { CollectionReference }
 */
export const fire_posts = collection(fs, "posts");

/**
 * Runs a callback on a query snapshot of the posts collection.
 *
 * @callback [onCommentSnapshot] - Callback on a query snapshot (e.g. use .size, .empty, .forEach) triggering when results are retrieved for the Comments collection
 */
export const postQuerySnapshot = async onCommentSnapshot => {
  return getDocs(fire_posts).then(snap => {
    onCommentSnapshot(snap);
  });
};

/**
 * Get a DocumentReference to a post. 
 *
 * @return { DocumentReference } - A reference to a document in Firestore database.
 */
export const getPostReference = () => {
  return doc(fire_posts);
};

/**
 * Saves a Post reference.
 * 
 * @param {*} fire_post - An existing DocumentReference to a Post.
 * @param {*} data_post - The Post data to be set.
 * @callback [onSetDocument] - Callback triggering when Comment document is successfully set.
 */
export const setPostReference = (
  fire_post,
  data_post,
  onSetDocument = () => {}
) => {
  setDoc(fire_post, data_post).then(() => {
    onSetDocument();
  });
};

/**
 * Gets a post document and optionally runs a callback on it.
 *
 * @param { string } post_key - The post id.
 * @callback [onGetDocument] - Callback on a document triggering when comment document is successfully retrieved.
 */
export const getPost = (post_key, onGetDocument = () => {}) => {
  getDoc(doc(fire_posts, post_key)).then(doc => {
    if (doc.exists()) {
      onGetDocument(doc);
    } else {
      console.error("No such Post document");
    }
  });
};

/**
 * Updates a Post in Firebase.
 *
 * @param { String } post_key - The post id.
 * @param { Object } data_post - Object with key-value pairs to edit in the post document.
 * @callback [onAfterupdate] - Callback triggering after a successful update. No document available.
 */
export const updatePost = (post_key, data_post, onAfterUpdate = () => {}) => {
  const fire_post_doc = doc(fire_posts, post_key);

  getDoc(fire_post_doc)
    .then(doc0 => {
      updateDoc(fire_post_doc, { ...doc0.data(), ...data_post })
        .then(() => {
          onAfterUpdate();
        })
        .catch(error => {
          console.error("Error updating post document: ", error);
        });
    })
    .catch(error => {
      console.error("Error getting a post: ", error);
    });
};

/**
 * Deletes text, username, etc. of a user's post document.
 *
 * @param { String } post_key - The post id.
 * @callback [onAfterupdate] - Callback triggering on a successful update of the Post document.
 */
export const invalidatePost = (post_key, onAfterupdate) => {
  const data_post = {
    author: "",
    comments: 1,
    plainText: "Post deleted",
    status: "closed",
    lastEdit: serverTimestamp()
  };
  updatePost(post_key, data_post, onAfterupdate);
};

/**
 * Gets the comments collection.
 * @type { CollectionReference }
 */
export const fire_comments = collection(fs, "comments");

/**
 * Gets a comment document and optionally runs a callback on it.
 *
 * @param { String } post_key - The post id.
 * @callback [onGetDocument] - Callback on a document triggering comment document is successfully retrieved.
 */
export const getComment = (post_key, onGetDocument = () => {}) => {
  getDoc(doc(fire_comments, post_key)).then(doc => {
    if (doc.exists()) {
      onGetDocument(doc);
    } else {
      console.error("No such Comment document");
    }
  })
  .catch(error => {
    console.error("Error on getting comment: ", error);
    return;
  });
};

/**
 * Add a user's comment (i.e. a map in the Comment document) at position comment_key.
 *
 * @param { String } post_key - The post id.
 * @param { Number } comment_key - The comment key.
 * @param { Object } data_comment
 * @callback [onSetDocument] - Callback triggering on a successful update of the Comment document.
 */
export const pushComment = (
  post_key,
  comment_key,
  data,
  onSetDocument = () => {}
) => {
  const fire_comment_doc = doc(fire_comments, post_key);

  getDoc(fire_comment_doc).then(doc => {
    var document = doc.data();

    if (!document) {
      document = {};
    }

    document[comment_key] = data;

    setDoc(fire_comment_doc, document)
      .then(onSetDocument())
      .catch(error => {
        console.error("Error on setting comment document: ", error);
      });
  });
};

/**
 * Updates a comment document.
 *
 * @param { String } post_key - The post id.
 * @param { String } commentid - The comment key.
 * @param { Object } data_comment - Object with key-value pairs to edit in the comment document.
 * @callback [onAfterSetDocument] - Callback triggering on a successful write of the Comment document.
 */
export const updateComment = (
  post_key,
  commentid,
  data_comment,
  onAfterSetDocument = () => {}
) => {
  const fire_comment_doc = doc(fire_comments, post_key);

  getDoc(fire_comment_doc)
    .then(doc0 => {
      var document = { ...doc0.data() };

      document[commentid] = { ...document[commentid], ...data_comment };

      setDoc(fire_comment_doc, document)
        .then(onAfterSetDocument())
        .catch(error => {
          console.error("Error on setting comment: ", error);
        });
    })
    .catch(error => {
      console.error("Error on getting comment: ", error);
      return;
    });
};

/**
 * Deletes text, username, etc. of a user's comment (i.e. a key of a comment document).
 *
 * @param { String } post_key - The post id.
 * @param { String } commentid - The comment key.
 * @callback [onAfterSetDocument] - Callback triggering on a successful write of the Comment document.
 */
export const invalidateComment = (post_key, commentid, onAfterSetDocument) => {
  const data_comment = {
    author: "",
    comments: 1,
    plainText: "Comment deleted",
    richText: "<blockquote>Comment deleted</blockquote>",
    lastEdit: serverTimestamp()
  };
  updateComment(post_key, commentid, data_comment, onAfterSetDocument);
};