import React, { useEffect, useState } from "react";
import "./style.css";
import axios from "axios";
import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardText,
  MDBCardBody,
  MDBCardImage,
  MDBBtn,
  MDBTypography,
} from "mdb-react-ui-kit";
import "bootstrap/dist/css/bootstrap.min.css";
import Posts from "../Posts";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "../redux/reducers/posts/index";
import AddPost from "../AddPost";
import { useParams } from "react-router-dom";
import FriendRequests from "./FriendRequests";
import AllFriends from "./AllFriends";
import SendMessage from "./SendMessage";
import EditProfileInfoBtn from "./EditProfileInfoBtn";
import { setUserInfo } from "../redux/reducers/auth/index";

const Profile = () => {
  const params = useParams();
  const id = params.id;

  //componant states
  const [user, setUser] = useState({});
  const [userData, setUserData] = useState(null);
  //dispatch
  const dispatch = useDispatch();

  const getuserdata = () => {
    axios
      .get(`http://localhost:5000/users/others/info/${id}`)
      .then((Response) => {
        console.log(Response.data.result);
        const fullName = {
          firstname: Response.data.result.firstname,
          lastname: Response.data.result.lastname,
        };
        setUser(fullName);
        setUserData(Response.data.result);
      })
      .catch((err) => {
        // console.log(err);
      });
  };

  //redux states
  const {
    posts,
    userinfo,
    token,
    userId,
    friends,
    sharedPosts,
    areUserInfoChanged,
  } = useSelector((state) => {
    return {
      posts: state.posts.posts,
      userinfo: state.auth.userinfo,
      token: state.auth.token,
      userId: state.auth.userId,
      friends: state.friends.friends,
      sharedPosts: state.posts.sharedPosts,
      areUserInfoChanged: state.posts.areUserInfoChanged,
    };
  });

  const getAllPostsByUserId = () => {
    axios
      .get(`http://localhost:5000/posts/search_1/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((Response) => {
        console.log(Response.data.posts);
        Response.data.posts.length > 0 &&
          dispatch(setPosts(Response.data.posts));
      })
      .catch((err) => {
        // console.log(err);
      });
  };

  //loggedin user info should be changed when he changes his info (pic)
  const getTheLoggedInUserInfo = () => {
    axios
      .get(`http://localhost:5000/users/info`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((Response) => {
        dispatch(setUserInfo(Response.data.info));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getAllPostsByUserId();
    getuserdata();
  }, [id, areUserInfoChanged]);

  useEffect(() => {
    getTheLoggedInUserInfo();
  }, [areUserInfoChanged]);

  return (
    <div>
      <div className="gradient-custom-2" style={{ backgroundColor: "#eee" }}>
        <MDBContainer className="py-5 h-100">
          <MDBRow className="justify-content-center align-items-center h-100">
            <MDBCol lg="9" xl="7">
              <MDBCard>
                <div
                  className="rounded-top text-white d-flex flex-row"
                  style={{
                    height: "200px",
                    backgroundColor: "#000",
                    backgroundImage: `url(${userData && userData.coverimg})`,
                    backgroundSize: "cover",
                  }}
                >
                  <div
                    className="ms-4 mt-5 d-flex flex-column"
                    style={{ width: "200px", height: "200px"}}
                  >
                    {/* <div style={{width:"150px",height:"200px",zIndex:"1"}}> */}
                    <MDBCardImage
                      src={
                        userData && userData.avatar
                          ? userData.avatar
                          : "https://png.pngtree.com/png-clipart/20210613/original/pngtree-gray-silhouette-avatar-png-image_6404679.jpg"
                      }
                      alt="image"
                      className="mt-4 mb-2 img-thumbnail"
                       fluid
                      style={{ minWidth: "150px", zIndex: "1", minHeight: "150px" }}
                      // style={{  zIndex: "1"}}

                    ></MDBCardImage>
                     {/* </div> */}
                    <MDBTypography
                      className="py-2"
                      tag="h5"
                      style={{
                        zIndex: "1",
                   
                        color: "black",
                        marginLeft: "7px",
                        
                      }}
                    >
                    
                      {userData && userData.firstname}
                      {"  "}
                      {userData && userData.lastname}
                    </MDBTypography>
                  
                  </div>
                </div>
                <div
                  className="p-4 text-black"
                  style={{ backgroundColor: "#f8f9fa" }}
                >
                   <div className="d-flex justify-content-start" style={{marginLeft:"200px", marginTop:"10px",position:"relative"}}>

                    {userId == id ? <EditProfileInfoBtn /> : ""}
                   </div>
                   <br/>
                  <div className="d-flex justify-content-end text-center py-1">
                    <div className="px-4">

                      <MDBCardText
                        className="p"
                        style={{ marginBottom: "0px" }}
                      >
                        {friends ? friends.length : 0}
                      </MDBCardText>
                      <MDBCardText className="small text-muted mb-0">
                        <AllFriends id={id} />
                      </MDBCardText>
                    </div>
                  </div>
                  <div className="d-flex justify-content-start text-center py-1">
                    <div className="profile-btn">
                      <br />
                      <MDBCardText className="small text-muted mb-0">
                        <FriendRequests id={id} />
                      </MDBCardText>
                      <MDBCardText className="small text-muted mb-0">
                        <SendMessage id={id} />
                      </MDBCardText>
                    </div>
                  </div>
                </div>
                <MDBCardBody className="text-black p-4">
                  {userData && userData.bio && (
                    <div className="mb-5">
                      <p className="lead fw-normal mb-1">About</p>
                      <div
                        className="p-4"
                        style={{ backgroundColor: "#f8f9fa" }}
                      >
                        <MDBCardText className="font-italic mb-1">
                          {userData.bio}
                        </MDBCardText>
                      </div>
                    </div>
                  )}
                  
                  <MDBRow className="g-2">
                    <MDBCol className="mb-2">
                      {id == userId && <AddPost />}
                    </MDBCol>
                  </MDBRow>
                  <MDBRow>
                    <MDBCol className="mb-2">
                      {/* dispaly the posts */}
                      {posts &&
                        posts.map((elem) => {
                          return (
                            <Posts
                              post={elem}
                              firstname={user.firstname}
                              lastname={user.lastname}
                              key={elem.post_id}
                              userData={userData}
                            />
                          );
                        })}
                    </MDBCol>
                  </MDBRow>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </div>
    </div>
  );
};

export default Profile;
