import * as React from "react";
import react, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";

import Tooltip from "@mui/material/Tooltip";
import { IoIosNotificationsOutline } from "react-icons/io";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setNotifications } from "../redux/reducers/posts";
export default function AccountMenu() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [notification, setNotification] = useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  //useDispatch
  const dispatch = useDispatch();

  //redux login states
  const { token, userId, isLoggedIn, Socket } = useSelector((state) => {
    //return object contains the redux states
    return {
      token: state.auth.token,
      isLoggedIn: state.auth.isLoggedIn,
      userId: state.auth.userId,
      Socket: state.posts.Socket,
    };
  });
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    axios
      .get(`http://localhost:5000/home/notification`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        console.log(response.data.result);
        setNotification(response.data.result);
        dispatch(setNotifications(response.data.result));
      })
      .catch(function (error) {
        throw error;
      });
  }, []);
  return (
    <React.Fragment>
      <Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
        <Tooltip title="Notifications">
          <Button
            onClick={handleClick}
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            <IoIosNotificationsOutline  className= "svg1" color='royalblue' size={25}/>
          </Button>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
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
        {!notification ? (
          <MenuItem onClick={handleClose}>You dont have notifications</MenuItem>
        ) : (
          notification.map((elem, i) => {
            return (
              <MenuItem onClick={handleClose} key={i}>
                <Avatar
                  src={
                    elem.avatar
                      ? elem.avatar
                      : "https://images.unsplash.com/photo-1575936123452-b67c3203c357?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8&auto=format&fit=crop&w=1000&q=60"
                  }
                />{" "}
                {elem.content}
              </MenuItem>
            );
          })
        )}
      </Menu>
    </React.Fragment>
  );
}
