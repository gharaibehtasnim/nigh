import React, { useState, useEffect } from "react";
import "./style.css";
import { Link } from "react-router-dom";
import Comments from "../Comments";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setUserInfo } from "../redux/reducers/auth/index";
import Dropdown from "react-bootstrap/Dropdown";
import UpdatePost from "../AddPost/UpdatePost";
import { removePost } from "../redux/reducers/posts/index";
import Likes from "./Likes";
import { setComments, addComment } from "../redux/reducers/posts/index";
import { io } from "socket.io-client";
import moment from "moment";
import { useSocket } from "../../App";

const Posts = ({ post, firstname, lastname, userData }) => {
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);
  const socket = useSocket(io);
  const [openComments, setopenComments] = useState(false);
  const dispatch = useDispatch();

  const { userinfo, token, userId, posts } = useSelector((state) => {
    return {
      posts: state.posts.posts,
      userinfo: state.auth.userinfo,
      token: state.auth.token,
      userId: state.auth.userId,
    };
  });

  const deletePost = async (id) => {
    try {
      await axios
        .delete(`http://localhost:5000/posts/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((result) => {
          dispatch(removePost(id));
        });
      //getAllP();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    userData && (
      <div className="posts">
        <div className="containers">
          <div className="user">
            <div className="userInfo">
              <img
                src={
                  userData.avatar
                    ? userData.avatar
                    : "https://png.pngtree.com/png-clipart/20210613/original/pngtree-gray-silhouette-avatar-png-image_6404679.jpg"
                }
                alt="img"
              />
              <div className="details">
                <Link
                  to={`/profile/${userData.user_id}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <span className="name">
                    {userData.firstname} {userData.lastname}
                  </span>
                </Link>
                <span className="date">
                  {moment(`${post.created_at}`).fromNow()}
                </span>
              </div>
            </div>
            <Dropdown>
              <Dropdown.Toggle
                variant="light"
                id="dropdown-basic"
                style={{ backgroundColor: "inherit" }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  className="bi bi-three-dots"
                  onClick={() => {}}
                >
                  <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
                </svg>
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item
                  onClick={() => {
                    setShow(true);
                  }}
                >
                  Edit
                </Dropdown.Item>

                <Dropdown.Item
                  onClick={() => {
                    deletePost(post.post_id);
                  }}
                >
                  Delete Post
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <div className="contant">
            {post.content && <p>{post.content}</p>}
            {post.image && <img src={post.image} alt="img" />}
            {post.video && (
              <embed
                width="100%"
                height="300px"
                className="embed"
                type="video/webm"
                src={post.video}
              /> 
            )}
          </div>
          <br></br>
          <div className="infomation">
            {post.post_id && (
              <Likes post_id={post.post_id} post={post} socket={socket} />
            )}

            <div
              onClick={() => {
                setopenComments(!openComments);
              }}
              className="item"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-chat-left-text-fill"
                viewBox="0 0 16 16"
              >
                <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4.414a1 1 0 0 0-.707.293L.854 15.146A.5.5 0 0 1 0 14.793V2zm3.5 1a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1h-9zm0 2.5a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1h-9zm0 2.5a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5z" />
              </svg> {"  "}
              comments
            </div>
              {/* <div className="item">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-send"
                viewBox="0 0 16 16"
              >
                <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z" />
              </svg>
              share
            </div> */}
          </div>
          

          {openComments && post.post_id && (
            <Comments
              id={post.post_id}
              firstname={userData.firstname}
              lastname={userData.lastname}
              socket={socket}
              style= {{height: "2rem"}}
            />
          )}

          {show ? (
            <UpdatePost showModal={show} post={post} setShowModal={setShow} />
          ) : (
            ""
          )}
        </div>
      </div>
    )
  );
};

export default Posts;
