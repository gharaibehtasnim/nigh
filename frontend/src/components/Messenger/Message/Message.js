import React, { useState, useEffect } from "react";
import "./message.css";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useNavigate, useParams, Outlet } from "react-router-dom";
import moment from "moment";


const Messages = ({ mine, message, theOpenedConversation }) => {

  // console.log("************", message);
  const [friendInfo, setFriendInfo] = useState(null);
  const [theFriendId, setTheFriendId] = useState("");

  //dispatch
  const dispatch = useDispatch();

  const { userinfo, token, userId } = useSelector((state) => {
    return {
      userinfo: state.auth.userinfo,
      token: state.auth.token,
      userId: state.auth.userId,
    };
  });

  //render the friend name and picture
  const getFriendId = () => {
    let userFriendId = theOpenedConversation.members.find((element) => {
      // console.log("*************", element);
      return element != userId;
    });
    console.log(userFriendId);
    setTheFriendId(userFriendId);
  };
  //loggedin user info should be changed when he changes his info (pic)
  const getFriendInfo = () => {
    axios
      .get(`http://localhost:5000/users/others/info/${theFriendId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        console.log(response.data.info);
        setFriendInfo(response.data.info);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // useEffect(() => {
  //   getFriendId();
  //   getFriendInfo();
  // }, [theFriendId]);

  // console.log(theFriendId);
  // console.log(message);

  return (
    <div>
      <div className={mine ? "my message" : "message"}>
        <div className="messageTop">
          <img
            className="messageImg"
            src={
              mine && userinfo
                ? userinfo.avatar
                : friendInfo && friendInfo.avatar
            }
            alt="img"
          />
          <p className="messageText">{message.text}</p>
        </div>
        <div className="messageBottom">{moment(`${message.createdAt}`).fromNow()}</div>
      </div>
    </div>
  );
};

export default Messages;
