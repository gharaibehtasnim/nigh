import React, { useState, useEffect } from "react";
import {
  MDBContainer,
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarItem,
  MDBNavbarLink,
  MDBBtn,
} from "mdb-react-ui-kit";

import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { BiDownArrow, BiHome } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setLogout } from "../redux/reducers/auth";
import NavFriendReq from "./NavFriendReq";
import Notifications from "./Notifications";
import { FcSearch } from "react-icons/fc";
import { TiMessages } from "react-icons/ti";
import { CgProfile } from "react-icons/cg";
import { MdOutlineLogout } from "react-icons/md";

const NavBar = () => {
  const [showBasic, setShowBasic] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  //useNavigate
  const navigate = useNavigate();

  //useDispatch
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  //redux login states
  const { token, userId, isLoggedIn, roleId, newMsg, userinfo, newReq } =
    useSelector((state) => {
      //return object contains the redux states
      return {
        token: state.auth.token,
        isLoggedIn: state.auth.isLoggedIn,
        userId: state.auth.userId,
        roleId: state.auth.roleId,
        newMsg: state.messenger.newMsg,
        userinfo: state.auth.userinfo,
        newReq: state.friends.newReq,
      };
    });

  //navigations functions
  const goToMyProfile = () => {
    navigate(`/profile/${userId}`);
    setShowBasic(false);
  };

  const login = () => {
    navigate(`/`);
    setShowBasic(false);
  };

  const register = () => {
    navigate(`/register`);
    setShowBasic(false);
  };

  const goToHome = () => {
    navigate(`/home`);
    setShowBasic(false);
  };

  const searchNow = () => {
    navigate(`/home/${searchValue}`);
    setShowBasic(false);
  };

  const goToMessenger = () => {
    navigate(`/messenger`);
    setShowBasic(false);
  };

  return (
    <div>
      {roleId == 1 ? (
        ""
      ) : isLoggedIn ? (
        <MDBNavbar expand="lg">
          <MDBContainer fluid>
            <MDBNavbarBrand href="/home" style={{ padding: "0px",margin:"0px" }}><img
                src="/logo.png"
                style={{ height: "50px", width: "100px", padding: "0px",margin:"0px" }}
                alt="logo"
              />
            </MDBNavbarBrand>

            <form className="d-flex input-group w-auto">
              <input
                type="search"
                className="form-control"
                placeholder="Search"
                aria-label="Search"
                onChange={(e) => {
                  setSearchValue(e.target.value);
                }}
              />
              <MDBBtn
color="secondary"
               style={{border:"1px solid gray"}}
                className="btn  btn-sm"
                onClick={searchNow}
              >
                <FcSearch size={20} />
              </MDBBtn>
            </form>
            <div className="nav-container">
              <Button
                onClick={() => {
                  goToHome();
                }}
              >
                {" "}
                <BiHome size={23} />
              </Button>

              <MDBNavbarItem>
                <MDBNavbarLink href="#">
                  <NavFriendReq />
                </MDBNavbarLink>
              </MDBNavbarItem>
              <Button
                onClick={() => {
                  goToMessenger();
                }}
              >
                <MDBNavbarLink href="#" className={newMsg ? "newMsg" : ""}>
                  <TiMessages color="royalblue" size={23} />
                </MDBNavbarLink>
              </Button>

              <MDBNavbarItem>
                <MDBNavbarLink>
                  <Notifications />
                </MDBNavbarLink>
              </MDBNavbarItem>
            </div>

            <Button
              id="demo-positioned-button"
              aria-controls={open ? "demo-positioned-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleClick}
            >
              <div className="userInfo">
                <span>
                  {" "}
                  <img
                    src={
                      userinfo && userinfo.avatar
                        ? userinfo.avatar
                        : "https://png.pngtree.com/png-clipart/20210613/original/pngtree-gray-silhouette-avatar-png-image_6404679.jpg"
                    }
                    alt=""
                  />
                  <BiDownArrow className="svg2" size={12} />
                </span>
              </div>
            </Button>
            <Menu
              anchorEl={anchorEl}
              id="account-menu"
              open={open}
              onClose={handleClose}
              onClick={handleClose}
              PaperProps={{
                elevation: 2,
                style: {
                  width: 120,
                },
                sx: {
                  overflow: "visible",
                  filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                  mt: 0.01,
                  "& .MuiAvatar-root": {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                  "&:before": {
                    content: '""',
                    display: "block",
                    position: "absolute",
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: "background.paper",
                    transform: "translateY(-50%) rotate(45deg)",
                    zIndex: 0,
                  },
                },
              }}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              <MenuItem
                onClick={() => {
                  goToMyProfile();
                  setAnchorEl(null);
                }}
              >
                {" "}
                <CgProfile />
                &nbsp;Profile
              </MenuItem>

              <MenuItem
                onClick={() => {
                  dispatch(setLogout());
                  setAnchorEl(null);
                  navigate("/");
                }}
              >
                <MdOutlineLogout />
                &nbsp;Logout
              </MenuItem>
            </Menu>
          </MDBContainer>
        </MDBNavbar>
      ) : (
        <MDBNavbar expand="lg" light bgColor="light">
          <MDBContainer fluid>
          <MDBNavbarBrand href="/" style={{ padding: "0px",margin:"0px" }}><img
                src="/logo.png"
                style={{ height: "50px", width: "100px", padding: "0px",margin:"0px" }}
                alt="This will display logo"
              /></MDBNavbarBrand>
            <div className="nav2">
              <MDBNavbarItem
                onClick={() => {
                  login();
                }}
              >
                <MDBNavbarLink
                  style={{ color: "black" }}
                  active
                  aria-current="page"
                  href="#"
                >
                  Login
                </MDBNavbarLink>
              </MDBNavbarItem>

              <MDBNavbarItem
                onClick={() => {
                  register();
                }}
              >
                <MDBNavbarLink
                  style={{ color: "black" }}
                  active
                  aria-current="page"
                  href="#"
                >
                  Register
                </MDBNavbarLink>
              </MDBNavbarItem>
            </div>
          </MDBContainer>
        </MDBNavbar>
      )}
    </div>
  );
};

export default NavBar;
