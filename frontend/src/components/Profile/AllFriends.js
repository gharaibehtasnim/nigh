import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import "./style.css";
import { useNavigate } from "react-router-dom";

import {
  getAlluserFriends,
  removeFriend,
  isTheUserIsFriend,
} from "../redux/reducers/friends/index";

const AllFriends = ({ id }) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  //dispatch
  const dispatch = useDispatch();

  //navigate
  const navigate = useNavigate();

  //redux states
  const { token, userId, friends, isFriend } = useSelector((state) => {
    return {
      friends: state.friends.friends,
      userId: state.auth.userId,
      token: state.auth.token,
      isFriend: state.friends.isFriend,
    };
  });

  //get all friends of any person depending on the user id
  const getAllFriends = () => {
    axios
      .get(`http://localhost:5000/friends/get/all/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(function (response) {
        dispatch(getAlluserFriends(response.data.result));

        //check if this profile is a friend of the loggedin user
        dispatch(isTheUserIsFriend(userId));
      })
      .catch(function (error) {
        // console.log(error);
      });
  };

  useEffect(() => {
    getAllFriends();
  }, [isFriend, id, userId]);

  //*remove friend function
  // i need the user2_id as a params (the friend id i want to remove)
  const UnFriend = (user2_id) => {
    axios
      .delete(`https://jade-cranachan-43b1d5.netlify.app/friends/remove/${user2_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(function (response) {
        dispatch(removeFriend(user2_id));
      })
      .catch(function (error) {
        // throw error;
      });
  };

  return (
    <div>
      <button
        style={{
          padding: "0px",
          border: "none",
          backgroundColor: "inherit",
          color: "#4f4f4f",
        }}
        onClick={handleShow}
      >
        Friends
      </button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Friends</Modal.Title>
        </Modal.Header>
        <Modal.Body className="friend-list-body">
          {friends && friends.length !== 0
            ? friends &&
              friends.map((element, i) => {
                return (
                  <div className="friend-list" key={element.id}>
                    <div
                      className="friend-img-name"
                      onClick={() => {
                        navigate(`/profile/${element.user_id}`);
                      }}
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
                    {userId == id ? (
                      <Button
                        className="remove-btn"
                        variant="danger"
                        onClick={() => {
                          UnFriend(element.user_id);
                        }}
                      >
                        Remove
                      </Button>
                    ) : (
                      ""
                    )}
                  </div>
                );
              })
            : "No Friends"}
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
    </div>
  );
};

export default AllFriends;
