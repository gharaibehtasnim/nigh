import React, { useState, useEffect } from "react";
import "./style.css";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  setLogin,
  setUserId,
  setUserInfo,
  setRoleId,
} from "../redux/reducers/auth";
import { GoogleLogin } from "@react-oauth/google";

import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBCardImage,
} from "mdb-react-ui-kit";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoggedIn, token, userinfo, userId, roleId } = useSelector(
    (state) => {
      return {
        isLoggedIn: state.auth.isLoggedIn,
        userinfo: state.auth.userinfo,
        token: state.auth.token,
        userId: state.auth.userId,
        roleId: state.auth.roleId,
      };
    }
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);

  const login = () => {
    axios
      .post("https://project-nigh.onrender.com/users/login", {
        email,
        password,
      })
      .then((result) => {
        localStorage.setItem("token", result.data.token);
        localStorage.setItem("userId", result.data.userId);
        localStorage.setItem("isLoggedIn", true);
        localStorage.setItem("roleId", result.data.roleId);
        dispatch(setRoleId(result.data.roleId));
        dispatch(setUserInfo(result.data.userInfo));

        dispatch(setLogin(result.data.token));
        dispatch(setUserId(result.data.userId));
      })
      .catch((error) => {
        setShow(true);
        setMessage(error.response.data.message);
      });
  };
  const gestLogin=()=>{
    axios
    .post("https://project-nigh.onrender.com/users/login", {
      email:"tasneem.gharaibeh@gmail.com",
      password:"123",
    })
    .then((result) => {
      localStorage.setItem("token", result.data.token);
      localStorage.setItem("userId", result.data.userId);
      localStorage.setItem("isLoggedIn", true);
      localStorage.setItem("roleId", result.data.roleId);
      dispatch(setRoleId(result.data.roleId));
      dispatch(setUserInfo(result.data.userInfo));

      dispatch(setLogin(result.data.token));
      dispatch(setUserId(result.data.userId));
    })
    .catch((error) => {
      setShow(true);
      setMessage(error.response.data.message);
    });
  }

  const loginGoogle = (result) => {
    const { credential, clientId } = result;
    axios
      .post("https://project-nigh.onrender.com/users/google", {
        credential,
        clientId,
      })
      .then((res) => {
        const { family_name, email } = res.data;
        const fakePass = family_name + 123456;

        axios
          .post("https://project-nigh.onrender.com/users/login", {
            email,
            password: fakePass,
          })
          .then((result) => {
            console.log(">>>>>>>>>>>>>", result);
            localStorage.setItem("token", result.data.token);
            localStorage.setItem("userId", result.data.userId);
            localStorage.setItem("isLoggedIn", true);
            localStorage.setItem("roleId", 2);
            dispatch(setLogin(result.data.token));
            dispatch(setUserId(result.data.userId));
            dispatch(setRoleId(2));
            dispatch(setUserInfo(result.data.userInfo));
          })
          .catch((err) => {
            setShow(true);
            setMessage(err.response.data.message);
          });
      });
  };
  const getAllUserInfo = () => {
    axios
      .get(`https://project-nigh.onrender.com/users/info`, {
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
    if (isLoggedIn && roleId == 1) {
      navigate("/dashboard");
      getAllUserInfo();
    }
    if (isLoggedIn && roleId == 2) {
      navigate("/home");
      getAllUserInfo();
    }
  });

  return (
    <MDBContainer className="py-5 h-100 center">
      <MDBCard
        className=" rounded-2"
        style={{ marginLeft: "0px", marginRight: "0px" }}
      >
        <MDBRow className="g-0">
          <MDBCol md="7">
            <div className="ratio ratio-16x9 hide">
              <iframe
                className="shadow-1-strong rounded hide"
                src="./nighw.mp4"
                mute={true}
                allowFullScreen
                alt="welcome"
                data-gtm-yt-inspected-2340190_699="true"
                id="388567449"
                style={{
                  marginLeft: "3rem",
                  marginTop: "5rem",
                  width: "40rem",
                }}
              ></iframe>
            </div>
          </MDBCol>

          <MDBCol md="4">
            <MDBCardBody className="d-flex flex-column">
              <div className="d-flex flex-row mt-2">
                <img
                  className="main-logo1 hide"
                  src="./main.png"
                  style={{
                    height: "100px",
                    width: "200px",
                    marginLeft: "5rem",
                    marginTop: "0px",
                  }}
                />
              </div>

              <h5
                className=" my-3 pb-2"
                style={{ letterSpacing: "1px", fontWeight: "700" }}
              >
                Sign to your account
              </h5>

              <MDBInput
                wrapperClass="mb-4"
                label="Email address"
                id="formControlLg"
                size="lg"
                className="email"
                type="email"
                onChange={(e) => setEmail(e.target.value)}
              />
              <MDBInput
                wrapperClass="mb-4"
                label="Password"
                id="formControlLg1"
                className="password"
                type="password"
                placeholder="Password"
                size="lg"
                onChange={(e) => setPassword(e.target.value)}
              />

              <MDBBtn
                outline
                className="mx-0 px-4"
                size="lg"
                onClick={(e) => {
                  login(e);
                }}
              >
                Login
              </MDBBtn>

              <br />
              <br />
              <MDBBtn
                outline
                className="mx-0 px-4"
                size="lg"
                onClick={(e) => {
                  gestLogin(e);
                }}
              >
                Login AS Gest
              </MDBBtn>
              <br />
              <br />

              <div>
                <p className="mb-0">
                  Don't have an account?{" "}
                  <a href="/register" className="fw-bold">
                    Sign Up
                  </a>
                </p>
              </div>
              <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                  <Modal.Title>Message</Modal.Title>
                </Modal.Header>
                <Modal.Body>{message}</Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleClose}>
                    Close
                  </Button>
                </Modal.Footer>
              </Modal>
              <GoogleLogin
                width={"90000px"}
                theme={"outline"}
                size={"large"}
                onSuccess={loginGoogle}
                onError={() => {
                  console.log("Login Failed");
                }}
              />
            </MDBCardBody>
          </MDBCol>
        </MDBRow>
      </MDBCard>
    </MDBContainer>
  );
};

export default Login;
