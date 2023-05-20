import React from "react";
import "./style.css";
import { useDispatch, useSelector } from "react-redux";
import { setLogout } from "../redux/reducers/auth";
import { useNavigate } from "react-router-dom";
import RecentActorsIcon from "@mui/icons-material/RecentActors";
import SwitchAccountIcon from "@mui/icons-material/SwitchAccount";
import ViewListIcon from "@mui/icons-material/ViewList";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LogoutIcon from "@mui/icons-material/Logout";
const Sidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userinfo, token, userId } = useSelector((state) => {
    return {
      userinfo: state.auth.userinfo,
      token: state.auth.token,
      userId: state.auth.userId,
    };
  });

  return (
    <div className="sidebar">
      <div className="top">
       <span><img
          src="./main.png"
          style={{
            height: "100px",
            width: "150px",
            marginLeft:"1rem",
          }}
        /></span>  
      </div>

      <div className="center">
        <p className="logo">Menu</p>
        <div className="widget">
          <img
            src={
              userinfo && userinfo.avatar && userinfo.avatar
                ? userinfo.avatar
                : "https://png.pngtree.com/png-clipart/20210613/original/pngtree-gray-silhouette-avatar-png-image_6404679.jpg"
            }
            alt=""
            style={{ width: "80px", height: "80px", borderRadius: "50%" }}
            onClick={() => {
              navigate(`/profile/${userId}`);
            }}
          ></img>

          <span
            onClick={() => {
              navigate(`/profile/${userId}`);
            }}
            style={{ marginTop: "1.8rem", marginRight: ".5rem" }}
          >
            {userinfo && userinfo.firstname}
            {"  "}
            {userinfo && userinfo.lastname}
          </span>
        </div>
      </div>

      <div className="bottom">
        <p
          onClick={() => {
            navigate(`/dashboard`);
          }}
        >
          <DashboardIcon /> Dashboard
        </p>

        <p
          onClick={() => {
            navigate(`/dashboard/users`);
          }}
        >
          <ViewListIcon /> Users
        </p>

        <p
          onClick={() => {
            navigate(`/dashboard/newusers`);
          }}
        >
          <RecentActorsIcon /> New users
        </p>

        <p
          onClick={() => {
            dispatch(setLogout());
            navigate(`/`);
          }}
        >
          <SwitchAccountIcon /> Switch account
        </p>

        <p
          onClick={() => {
            dispatch(setLogout());
            navigate(`/`);
          }}
        >
          <LogoutIcon /> Logout
        </p>
      </div>
    </div>
  );
};

export default Sidebar;
