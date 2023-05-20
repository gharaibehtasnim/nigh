import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import axios from "axios";
import "./syle.css";
import { SlPeople } from "react-icons/sl";
import {
  setSentReq,
  setReceivedReq,
  cancelFriendReq,
  setIsAdded,
  setIsReceived,
  declineFriendReq,
  setIsFriend,
  getAlluserFriends,
  setNewReq,
} from "../redux/reducers/friends/index";

export default function BasicMenu() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    dispatch(setNewReq(false));
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  //dispatch
  const dispatch = useDispatch();

  //redux states
  const {
    userId,
    token,
    sentReq,
    ReceivedReq,
    isAdded,
    isReceived,
    isFriend,
    newReq,
  } = useSelector((state) => {
    //return object contains the redux states
    return {
      userId: state.auth.userId,
      token: state.auth.token,
      sentReq: state.friends.sentReq,
      ReceivedReq: state.friends.ReceivedReq,
      isAdded: state.friends.isAdded,
      isReceived: state.friends.isReceived,
      isFriend: state.friends.isFriend,
      newReq: state.friends.newReq,
    };
  });

  //get all friends of the logged in user
  const getAllFriends = () => {
    axios
      .get(`http://localhost:5000/friends/get/all/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(function (response) {
        dispatch(getAlluserFriends(response.data.result));
      })
      .catch(function (error) {
        // throw error
      });
  };

  const ReceivedRequests = () => {
    //*ME => receiver_id

    axios
      .get(`http://localhost:5000/friends/received/requests`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(function (response) {
        // response.data.result => array of received requests
        dispatch(setReceivedReq(response.data.result));
        // console.log("setReceivedReq", response.data.result);
        if (response.data.result && response.data.result.length !== 0) {
          dispatch(setNewReq(true));
        }
      })
      .catch(function (error) {
        throw error;
      });
  };

  const SentRequests = () => {
    //*ME => sender_id

    axios
      .get(`http://localhost:5000/friends/sent/requests`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(function (response) {
        // console.log(response.data.result);
        //response.data.result => array of sent requests
        dispatch(setSentReq(response.data.result));
      })
      .catch(function (error) {
        throw error;
      });
  };

  const acceptFriendReq = (sender_id) => {
    axios
      .post(
        `http://localhost:5000/friends/accept`,
        { user2_id: sender_id },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(function (response) {
        dispatch(setIsFriend(true));
        dispatch(setIsAdded(false));
        dispatch(setIsReceived(false));
      })
      .catch(function (error) {
        throw error;
      });
  };

  useEffect(() => {
    getAllFriends();
    SentRequests();
    ReceivedRequests();
  }, [isAdded, isReceived, isFriend]);

  //cancel friend request
  const cancelFriendReqFun = (receiver_id) => {
    axios
      .delete(`http://localhost:5000/friends/cancel/${receiver_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(function (response) {
        dispatch(setIsAdded(false));
        dispatch(cancelFriendReq(receiver_id));

        // const newSentArr = sentReq.filter((element, i) => {
        //   return element.receiver_id !== receiver_id;
        // });
        // setSentReq(newSentArr);
      })
      .catch(function (error) {
        throw error;
      });
  };

  //decline the friend request
  // when the receiver delete or decline the request
  const declineFriendReqFun = (sender_id) => {
    axios
      .delete(`http://localhost:5000/friends/decline/${sender_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(function (response) {
        // console.log(response.data.result);
        dispatch(setIsReceived(false));
        dispatch(declineFriendReq(sender_id));
      })
      .catch(function (error) {
        throw error;
      });
  };

  return (
    <div>
      <Button
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <div className={newReq && "new-req-badge"}></div>
        <SlPeople size={22} />
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        style={{ width: "500rem" }}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <Tabs
          defaultActiveKey="Add Requests"
          id="uncontrolled-tab-example"
          className="mb-3"
        >
          <Tab eventKey="Add Requests" title="Add Requests">
            <div className="friend-list-body">
              {ReceivedReq
                ? ReceivedReq.map((element) => {
                    return (
                      <div key={element.request_id}>
                        <div className="friend-list">
                          <div className="friend-img-name">
                            <img
                              className="friend-img"
                              alt="img"
                              src={
                                element.avatar ||
                                "https://png.pngtree.com/png-clipart/20210613/original/pngtree-gray-silhouette-avatar-png-image_6404679.jpg"
                              }
                            />

                            <p>{element.firstname + " " + element.lastname}</p>
                          </div>
                          <div className="buttons">
                            <Button
                              variant="contained"
                              size="small"
                              color="success"
                              onClick={() => {
                                acceptFriendReq(element.sender_id);
                              }}
                            >
                              Accept
                            </Button>
                            <Button
                              variant="contained"
                              size="small"
                              color="error"
                              onClick={() => {
                                declineFriendReqFun(element.sender_id);
                              }}
                            >
                              Decline
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                : "No requests"}
            </div>
          </Tab>
          <Tab eventKey="Sent Requests" title="Sent Requests">
            <div className="friend-list-body">
              {sentReq
                ? sentReq.map((element) => {
                    return (
                      <div key={element.request_id}>
                        <div className="friend-list">
                          <div className="friend-img-name">
                            <img
                              className="friend-img"
                              alt="img"
                              src={
                                element.avatar ||
                                "https://png.pngtree.com/png-clipart/20210613/original/pngtree-gray-silhouette-avatar-png-image_6404679.jpg"
                              }
                            />

                            <p>{element.firstname + " " + element.lastname}</p>
                          </div>
                          <div className="buttons">
                            <Button
                              variant="contained"
                              size="small"
                              color="error"
                              onClick={() => {
                                cancelFriendReqFun(element.receiver_id);
                              }}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                : "you haven't sent any requests"}
            </div>
          </Tab>
        </Tabs>

        {/* <MenuItem onClick={handleClose}>Profile</MenuItem>
        <MenuItem onClick={handleClose}>My account</MenuItem>
        <MenuItem onClick={handleClose}>Logout</MenuItem> */}
      </Menu>
    </div>
  );
}
