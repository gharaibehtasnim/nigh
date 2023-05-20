import React from "react";
import {
  MDBFooter,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBIcon,
} from "mdb-react-ui-kit";

const Footer = () => {
  return (
    <MDBFooter
      bgColor="white"
      className="text-center text-lg-left"
       
    >
      <div className="text-center p-4">
        Copyright &copy; {new Date().getFullYear()}{" "}
        <span style={{ color:"#FF914D" }}><img src="/logoF.png"  style={{ height: "25px", width: "40px", padding: "0px",margin:"0px" }}/>.</span>
      </div>
    </MDBFooter>
  );
};
export default Footer;



