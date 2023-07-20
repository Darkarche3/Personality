import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { orderBy, limit, onSnapshot, query, QuerySnapshot } from "firebase/firestore";
import Navbar from "../components/Navbar";
import { Pages } from "../components/Pages";
import {
  truncate,
  getDateObject,
  getDateTime,
  timeDifference
} from "../scripts/Utilities";
import {
  fire_posts,
  postQuerySnapshot
} from "../scripts/FirebaseUtilities";

// The amount of characters the forum post text would be truncated to.
export const TRUNCATION_LIMIT = 290;
// The number of posts that can be seen in one page.
export const PAGE_SIZE = 20;

export const ForumList = () => {
  const [posts, setPosts] = useState([]);
  const [sortBy, setSortBy] = useState("timestamp");
  const [direction, setDirection] = useState("desc");
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(undefined);

  let pagesCount = 0;
  let dataSetSize = undefined;
  let unsubscribe = null;

  useEffect(() => {
    // Get the total number of posts for the page count, run initial query.
    postQuerySnapshot(snap => {
      dataSetSize = snap.size;
      pagesCount = Math.ceil(dataSetSize / PAGE_SIZE);
      // Trigger the next useEffect.
      setCurrentPage(0);
    });
  });

  useEffect(() => {
    // Get the posts now and subscribe to updates.
    unsubscribe = onSnapshot(query(
      fire_posts, 
      orderBy(sortBy, direction), 
      limit(currentPage * PAGE_SIZE + PAGE_SIZE)),
      onPostsCollectionUpdate);
  }, [sortBy, direction, currentPage]);

  /**
   * Gets the posts from the QuerySnapshot.
   * 
   * @param { QuerySnapshot } querySnapshot - The Query Snapshot to get posts from.
   */
  const onPostsCollectionUpdate = querySnapshot => {
    const posts = [];
    
    querySnapshot.forEach(doc => {
      posts.push({ ...doc.data(), key: doc.id });
    });

    // Write to state
    setPosts(posts);
    setIsLoading(false);
  };

  useEffect(() => {
    // Cancels the snapshot listener.
    return () => {
      unsubscribe();
    };
  });

  /**
   * Handles a double click of an item in the header.
   * 
   * @param { Event } event
   */
  const onDoubleClickHeader = event => {
    event.stopPropagation();

    // Block event on <span>
    if (event.target.tagName !== "TH") {
      return;
    }

    // Set sortBy and direction in state based on previous state and what was clicked
    let targetname = event.target.attributes.name.nodeValue;
    let dir = "desc";

    if (sortBy === targetname) {
      dir = direction === "desc" ? "asc" : "desc";
    }

    setIsLoading(true);
    setSortBy(targetname);
    setDirection(dir);
  };

  /**
   * Renders the sorting for a certain item.
   * 
   * @param { String } targetname - The item that the posts would be sorted by. 
   * @return { String }
   */
  const renderSorting = targetname => {
    if (sortBy !== targetname) {
      return "";
    }

    return direction === "desc" ? "\u00A0\u25B4" : "\u00A0\u25BE";
  };
  /**
   * Handles a Pagination change.
   * 
   * @param { Event } event
   * @param { Number } page
   */
  const pageClick = (event, page) => {
    event.preventDefault();
    setIsLoading(true);
    setCurrentPage(page);
  }

  return (
    <div className="container">
      <Navbar />
      <div className="panel panel-default">
        <br />
        <div className="panel-heading">
          <h3 className="panel-title">Posts</h3>
        </div>
        <br />

        <div className="panel-body">
          {isLoading && <div className="spinner" />}
          {!isLoading && (
            <div>
              <div className="tablePosts">
                <table className="table mb-0">
                  <thead>
                    <tr>
                      <th>Picture</th>
                      <th
                        name="title"
                        onDoubleClick={event =>
                          onDoubleClickHeader(event)
                        }
                      >
                        Title
                        <span>{decodeURI(renderSorting("title"))}</span>
                      </th>
                      <th
                        name="plainText"
                        onDoubleClick={event =>
                          onDoubleClickHeader(event)
                        }
                      >
                        Text
                        <span>
                          {decodeURI(renderSorting("plainText"))}
                        </span>
                      </th>
                      <th
                        name="comments"
                        onDoubleClick={event =>
                          onDoubleClickHeader(event)
                        }
                      >
                        Comments
                        <span>
                          {decodeURI(renderSorting("comments"))}
                        </span>
                      </th>
                      <th
                        name="author"
                        onDoubleClick={event =>
                          onDoubleClickHeader(event)
                        }
                      >
                        Author
                        <span>{decodeURI(renderSorting("author"))}</span>
                      </th>
                      <th
                        name="status"
                        onDoubleClick={event =>
                          onDoubleClickHeader(event)
                        }
                      >
                        Status
                        <span>{decodeURI(renderSorting("status"))}</span>
                      </th>
                      <th
                        name="timestamp"
                        onDoubleClick={event =>
                          onDoubleClickHeader(event)
                        }
                      >
                        Created
                        <span>
                          {decodeURI(renderSorting("timestamp"))}
                        </span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {posts.length === 0 && (
                      <tr className="border-bottom-0">
                        <td>No posts</td>
                      </tr>
                    )}
                    {posts.length > 0 &&
                      posts
                        .slice(
                          currentPage * PAGE_SIZE,
                          (currentPage + 1) * PAGE_SIZE
                        )
                        .map((post, i) => (
                          <tr
                            key={post.key}
                            className={"alt" + ((i % 2) + 1)}
                          >
                            <td>
                              <Link
                                to={`/post/${post.key}`}
                                className="postTitle"
                              >
                                {post.title}
                              </Link>
                            </td>
                            <td>
                              {truncate(post.plainText, TRUNCATION_LIMIT)}
                            </td>
                            <td>{post.comments - 1}</td>
                            <td>{post.author}</td>
                            <td>{post.status}</td>
                            <td
                              title={getDateTime(
                                getDateObject(post.timestamp)
                              )}
                            >
                              {timeDifference(getDateObject(post.timestamp))}
                            </td>
                          </tr>
                        ))}
                  </tbody>
                </table>
              </div>

              <Pages 
                currentPage={currentPage} 
                pagesCount={pagesCount}
                handlePageClick={(event, page) => pageClick(event, page)}
              />
            </div>
          )}
          <div>
            <Link to="/create" className="btn btn-bgn">
              New Post
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};