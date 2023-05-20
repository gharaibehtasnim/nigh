import React, { useState, useEffect, useRef } from "react";

import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBIcon,
  MDBBtn,
  MDBTypography,
  MDBTextArea,
  MDBCardHeader,
} from "mdb-react-ui-kit";
import "./messenger.css";
import Conversation from "./Conversation/Conversation";
import Message from "./Message/Message";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setFriendInfo } from "../redux/reducers/Messenger/index";
import { io } from "socket.io-client";
import { useNavigate, useParams, Outlet } from "react-router-dom";
import CurrentConversation from "./CurrentConversation";
import {
  setTheOpenedConversation,
  setConversations,
} from "../redux/reducers/Messenger/index";
import OnlineFriends from "./OnlineFriends/OnlineFriends";

const ENDPOINT = "http://localhost:5000";
//connect to the backend server
// const socket = io.connect(ENDPOINT);

const Messenger = () => {
  const navigate = useNavigate();

  //componant states
  // const [conversations, setConversations] = useState([]);
  // const [theOpenedConversation, setTheOpenedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newWrittenMessage, setNewWrittenMessage] = useState("");
  const [socket, setSocket] = useState(io(ENDPOINT, { autoConnect: false }));
  const [sending, setSending] = useState(false);
  const [receiving, setReceiving] = useState(false);
  const scrollRef = useRef();
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [friendInfo, setFriendInfo] = useState(null);

  const dispatch = useDispatch();

  const {
    userinfo,
    token,
    userId,
    conversationFriendInfo,
    openConversation,
    theOpenedConversation,
    conversations,
  } = useSelector((state) => {
    return {
      userinfo: state.auth.userinfo,
      token: state.auth.token,
      userId: state.auth.userId,
      conversationFriendInfo: state.messenger.conversationFriendInfo,
      openConversation: state.messenger.openConversation,
      theOpenedConversation: state.messenger.theOpenedConversation,
      conversations: state.messenger.conversations,
    };
  });

  //connect to the backend server
  useEffect(() => {
    socket.connect();
    socket.emit("ADD_USER", userId);
  }, []);

  useEffect(() => {
    socket?.on("GET_MESSAGE", (data) => {
      console.log(data);
      setMessages([
        ...messages,
        {
          sender: data.sender_id,
          text: data.text,
          createdAt: Date.now(),
        },
      ]);
    });
    setReceiving(true);
  }, [messages]);

  // useEffect(() => {
  //   arrivedMessage &&
  //     theOpenedConversation?.members.includes(arrivedMessage.sender) &&
  //     setMessages((prev) => [...prev, arrivedMessage]);
  // }, [arrivedMessage, theOpenedConversation]);

  //get all user's conversations
  const getAllUserConversations = () => {
    axios
      .get(`http://localhost:5000/conversation/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(function (response) {
        // console.log(response.data);
        dispatch(setConversations(response.data));
      })
      .catch(function (error) {
        throw error;
      });
  };

  //get the conversation messages
  const getAllConversationMessages = () => {
    const receiver_id = theOpenedConversation?.members.find(
      (member) => member != userId
    );

    theOpenedConversation &&
      axios
        .get(
          `http://localhost:5000/messages/${theOpenedConversation._id}/${receiver_id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        .then(function (response) {
          console.log(response.data);
          setMessages(response.data);
          setSending(true);
        })
        .catch(function (error) {
          throw error;
        });
  };

  const SendNewMsg = () => {
    // setCurrentUserId(userId);
    axios
      .post(
        `http://localhost:5000/messages`,
        {
          text: newWrittenMessage,
          sender: userId,
          conversationId: theOpenedConversation._id,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(function (response) {
        // console.log(response.data);
        const receiver_id = theOpenedConversation.members.find(
          (member) => member != userId
        );
        // console.log(theOpenedConversation);
        // console.log(receiver_id);
        socket.emit("SEND_MESSAGE", {
          sender_id: userId,
          receiver_id: receiver_id,
          text: newWrittenMessage,
        });
        setNewWrittenMessage("");
        setMessages([...messages, response.data]);
      })
      .catch(function (error) {
        throw error;
      });
  };

  const getFriendInfo = () => {
    const receiver_id = theOpenedConversation?.members.find(
      (member) => member != userId
    );
    theOpenedConversation &&
      axios
        .get(`http://localhost:5000/users/others/info/${receiver_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setFriendInfo(response.data.result);
        })
        .catch((err) => {
          console.log(err);
        });
  };

  useEffect(() => {
    getAllUserConversations();
    getAllConversationMessages();
    getFriendInfo();
  }, [theOpenedConversation]);

  useEffect(() => {
    socket?.on("GET_USERS", (users) => {
      console.log(users);
      setOnlineUsers(users);
    });
  }, [userId]);

  // useEffect(() => {
  //   socket?.on("welcome", (msg) => {
  //     console.log(msg);
  //   });
  // }, [socket]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <MDBContainer fluid className="py-5" style={{ backgroundColor: "#eee",paddingLeft:"10rem",paddingRight:"8rem"  }}>
      <MDBRow>
        <MDBCol md="4" lg="3" xl="3" className="mb-4 mb-md-0">
          <h5 className="font-weight-bold mb-3 text-center text-lg-start">
            Chats
          </h5>
          {conversations?.map((element) => {
            return (
              <MDBCard >
                <MDBCardBody style={{ paddingTop: "0px" }}>
                  <MDBTypography listUnStyled className="mb-0">
                    <li className="p-2 border-bottom">
                      <div
                        className="d-flex flex-row"
                        style={{ padding: "0px" }}
                      >
                        <p
                          className="fw-bold mb-0"
                          key={element._id}
                          onClick={() => {
                            dispatch(setTheOpenedConversation(element));
                          }}
                        >
                          <Conversation
                            Oneconversation={element}
                            theOpenedConversation={theOpenedConversation}
                          />
                        </p>
                      </div>
                    </li>
                  </MDBTypography>
                </MDBCardBody>
              </MDBCard>
            );
          })}
        </MDBCol>

        <MDBCol md="5" lg="5" xl="6">
          <MDBTypography listUnStyled>
            {theOpenedConversation ? (
              <MDBCard>
                <MDBCardHeader
                  className="d-flex justify-content-between p-3"
                  style={{ border: "none" }}
                >
                  <p className="fw-bold mb-0">
                    {" "}
                    {theOpenedConversation &&
                      friendInfo &&
                      friendInfo?.firstname + " " + friendInfo?.lastname}
                  </p>
                </MDBCardHeader>
                <MDBCardBody className="chatBoxWrapper ">
                  <div>
                    <div className="chatBoxTop">
                      {messages.map((element) => {
                        // console.log(element);
                        return (
                          <div>
                            <Message
                              message={element}
                              mine={element.sender == userId ? true : false}
                              theOpenedConversation={theOpenedConversation}
                              friendInfo={friendInfo}
                            />
                          </div>
                        );
                      })}
                    </div>
                    <div className="chatBoxBottom">
                      <input
                        className="chatMessageInput"
                        placeholder="write something..."
                        onChange={(e) => {
                          // console.log(e.target.value);
                          setNewWrittenMessage(e.target.value);
                        }}

                        // value={newMessage}
                      ></input>
                      <br />
                      <button className="chatSubmitButton" onClick={SendNewMsg}>
                        Send
                      </button>
                    </div>
                  </div>
                </MDBCardBody>
              </MDBCard>
            ) : (
              <div className="noConversationText">"Open a conversation"</div>
            )}
          </MDBTypography>
        </MDBCol >
        <MDBCol md="5" lg="5" xl="3">
          <h5 className="font-weight-bold mb-3 text-center text-lg-start">
            Active now
          </h5>
          <MDBCard>
            <MDBCardBody>
              <OnlineFriends onlineUsers={onlineUsers} />
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};

export default Messenger;
