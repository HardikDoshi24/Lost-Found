import React from "react";
import axios from "axios";
import logo from "../Assets/DDU.png";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();

  const handleLogout = async (event) => {
    event.preventDefault();
    await axios
      .get("http://localhost:8000/coordinator/logout", {
        withCredentials: true,
      })
      .then((response) => navigate("/coordinator/login"));
  };

  return (
    <div className="main-header">
      <header className="header">
        <Link to="/">
          <div id="left">
            <div>
              <img id="logo" src={logo} alt="PR" />
            </div>
            <div id="pr">
              <p className="titleText">Lost and Found</p>
            </div>
          </div>
        </Link>

        <div id="right">
          <ul className="nav-links">
            <li>
              <button className="btn" onClick={handleLogout}>
                Logout
              </button>
            </li>
          </ul>
        </div>
      </header>
    </div>
  );
}

export default Header;
