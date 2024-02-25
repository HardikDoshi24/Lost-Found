import React from "react";
import admin_img from "../Assets/admini_2.png";
import Coordi_img from "../Assets/administrator.png";
import std_img from "../Assets/graduating-student.png";
import { Link } from "react-router-dom";
import BeforeLoginNavbar from "../components/Navbar";

function SelectRole() {
  return (
    <div>
      <BeforeLoginNavbar />
      <div className="Main">
        <div className="askRoleTitle">
          <p className="askRole-text">What's your role?</p>
        </div>
        <div className="roleBox">
          <Link to="/admin/login">
            <div className="rolebox-in">
              <img id="admin-img" src={admin_img} alt="" srcSet="" />
              <p className="role-text1">Admin</p>
            </div>
          </Link>
          <Link to="/coordinator/login">
            <div className="rolebox-in">
              <img id="Coordi-img" src={Coordi_img} alt="" srcSet="" />
              <p className="role-text2">Coordinator</p>
            </div>
          </Link>
          <Link to="/student/login">
            <div className="rolebox1-in">
              <img id="std-img" src={std_img} alt="" srcSet="" />
              <p className="role-text3">Student</p>
            </div>
          </Link>
        </div>
        {/* <div className="nbtn">
        <button className="nextbtn">Next</button>
      </div> */}
      </div>
    </div>
  );
}

export default SelectRole;
