import React from "react";
import logo from "../Assets/DDU.png";
import { Link } from "react-router-dom";

function Header() {
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
            {/* <li>
              <Link to="/login">
                <button className="btn">Sign-in</button>
              </Link>
            </li> */}
            <li>
              <Link to="/selectrole">
                <button className="btn">Login</button>
              </Link>
            </li>
          </ul>
        </div>
      </header>
    </div>
  );
}

export default Header;
