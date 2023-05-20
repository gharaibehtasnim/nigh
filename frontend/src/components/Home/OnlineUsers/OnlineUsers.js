import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import "./OnlineUsers.css";

const OnlineUsers = ({ onlineUsersArr }) => {
  console.log(onlineUsersArr);
  const [onlineFriends, setOnlineFriends] = useState([]);
  const [theFriendId, setTheFriendId] = useState(null);
  const [friendsInfo, setFriendsInfo] = useState([]);
  const [onliners, setOnliners] = useState([]);

  const { token, userId, conversationFriendInfo, friends, conversations } =
    useSelector((state) => {
      return {
        token: state.auth.token,
        userId: state.auth.userId,
        conversationFriendInfo: state.messenger.conversationFriendInfo,
        friends: state.friends.friends,
        conversations: state.messenger.conversations,
      };
    });

  const getOnlineUsersIds = () => {
    setOnliners([]);
    onlineUsersArr.forEach((element) => {
      onliners.push(Number(element.userId));
      setOnliners(onliners);
    });
  };

  const checkIfAFriendIsOnline = () => {
    if (friends) {
      const results = friends.filter((frd) => {
        console.log(onliners.includes(frd.user_id));

        if (onliners.includes(frd.user_id)) {
          return frd;
        }
      });
      console.log(results);
      setOnlineFriends(results);
    }
  };

  useEffect(() => {
    getOnlineUsersIds();
  }, [onlineUsersArr]);

  useEffect(() => {
    checkIfAFriendIsOnline();
  }, [onliners, onlineUsersArr]);



  return (
    <div className="chatOnline">
      {onlineFriends.map((o) => (
        <div
          key={o.user_id}
          className="chatOnlineFriend"
          // onClick={() => handleClick(o)}
        >
          <div className="chatOnlineImgContainer">
            <img
              className="chatOnlineImg"
              src={
                o?.avatar ||
                "https://png.pngtree.com/png-clipart/20210613/original/pngtree-gray-silhouette-avatar-png-image_6404679.jpg"
              }
              alt="img"
            />
            <div className="chatOnlineBadge"></div>
          </div>
          <span className="chatOnlineName">{`${o && o.firstname} ${
            o.lastname
          }`}</span>
        </div>
      ))}
    </div>
  );
};

export default OnlineUsers;
