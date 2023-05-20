import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addLike, setLike, removeLike } from "../redux/reducers/posts";
import { AiFillLike } from "react-icons/ai";

import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
const Likes = ({ post_id, post }) => {
  const [clicked, setClicked] = useState("no");
  const [likesNo, setLikesNo] = useState();
  const [likedUser, setLikedUser] = useState();
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const dispatch = useDispatch();

  const { token, likes, userId } = useSelector((state) => {
    return {
      token: state.auth.token,
      likes: state.posts.likes,
      userId: state.auth.userId,
    };
  });

  const getLikes = () => {
    axios
      .get(`http://localhost:5000/likes/l`)
      .then((result) => {
        const user = result.data.users;
        const LikesNo2 = result.data.num;
        dispatch(setLike({ user, LikesNo2 }));
        user.map((elem) => {
          if (elem.post_id == post_id && userId == elem.user_id) {
            setClicked("yes");
          }
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    getLikes();
  }, []);

  const handleLike = (e) => {
    const id = e.target.id;
    if (clicked === "yes") {
      setClicked("no");
      axios
        .delete(`http://localhost:5000/likes/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((result) => {
          getLikes();
          dispatch(removeLike(id));
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      setClicked("yes");
      axios
        .post(
          "http://localhost:5000/likes",
          {
            post_id: id,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        .then((result) => {
          getLikes();
          dispatch(addLike(result.data.result));
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  return (
    <>
      <div id="post-info">
        <AiFillLike
          style={{ color: "blue", cursor: "pointer" }}
          onClick={(e) => {
            setShow(true);
          }}
        />{" "}
        {likes.length > 0 &&
          likes[0].LikesNo2.length > 0 &&
          likes[0].LikesNo2.flat().reduce((acc, elem) => {
            if (post_id == elem.post_id) {
              return <span key={post_id}>{elem.total_likes}</span>;
            } else {
              return <span key={post_id}>{acc}</span>;
            }
          }, 0)}
      </div>

      <div className="item" onClick={handleLike} id={post_id}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className={clicked}
          id={post_id}
          viewBox="0 0 16 16"
        >
          <path
            id={post_id}
            d="M6.956 1.745C7.021.81 7.908.087 8.864.325l.261.066c.463.116.874.456 1.012.965.22.816.533 2.511.062 4.51a9.84 9.84 0 0 1 .443-.051c.713-.065 1.669-.072 2.516.21.518.173.994.681 1.2 1.273.184.532.16 1.162-.234 1.733.058.119.103.242.138.363.077.27.113.567.113.856 0 .289-.036.586-.113.856-.039.135-.09.273-.16.404.169.387.107.819-.003 1.148a3.163 3.163 0 0 1-.488.901c.054.152.076.312.076.465 0 .305-.089.625-.253.912C13.1 15.522 12.437 16 11.5 16H8c-.605 0-1.07-.081-1.466-.218a4.82 4.82 0 0 1-.97-.484l-.048-.03c-.504-.307-.999-.609-2.068-.722C2.682 14.464 2 13.846 2 13V9c0-.85.685-1.432 1.357-1.615.849-.232 1.574-.787 2.132-1.41.56-.627.914-1.28 1.039-1.639.199-.575.356-1.539.428-2.59z"
          />
        </svg> {"  "}
        like
      </div>
      <Modal
        show={show}
        onHide={handleClose}
        animation={false}
        dialogClassName="modal-90w"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <AiFillLike style={{ color: "blue", fontSize: "1.2rem" }} />
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {likes.length > 0 &&
            likes[0].user.flat().map((element, id) => {
              if (element.post_id == post_id) {
                return (
                  <div
                    className="friend-list"
                    key={id}
                    style={{ marginBottom: ".5rem" }}
                  >
                    <div
                      className="friend-img-name"
                      style={{ cursor: "pointer" }}
                    >
                      <img
                        className="friend-img"
                        alt="img"
                        src={
                          element.avatar ||
                          "https://png.pngtree.com/png-clipart/20210613/original/pngtree-gray-silhouette-avatar-png-image_6404679.jpg"
                        }
                      />

                      <h6>{element.firstname + " " + element.lastname}</h6>
                    </div>
                  </div>
                );
              }
            })}
          {likes.length > 0 &&
            likes[0].user.flat().reduce((acc, element) => {
              if (element.post_id !== post_id) {
                return <p key={post_id}>{acc}</p>;
              }
            }, "There is no likes on this post")}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Likes;
