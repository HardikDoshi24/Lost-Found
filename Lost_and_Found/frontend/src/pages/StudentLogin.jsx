import React from "react";
import "react-toastify/dist/ReactToastify.css";
import image from "../Assets/Ellipse 5.png";
import Glogo from "../Assets/google 1.png";
import BeforeLoginNavbar from "../components/Navbar";

export default function StudentLogin() {
  return (
    <div>
      <div>
        <BeforeLoginNavbar />
        <div className="workspace">
          <div className="glogin-box flex-box">
            <div className="glogin-title">
              <p>Login to L&F Helper</p>
              <h6 className="notice-text">Login with DDU Account</h6>
              <a
                href="http://localhost:8000/auth/google"
                type="submit"
                className="glogo-box"
                id="glogin-btn"
              >
                <img src={Glogo} className="glogo" alt="" srcSet="" />
                <p className="Login-btn-text">Login with Google</p>
              </a>
            </div>
          </div>
          <div className="main-right">
            <img src={image} className="img" alt="" srcSet="" />
          </div>
        </div>
      </div>
    </div>
  );
}
