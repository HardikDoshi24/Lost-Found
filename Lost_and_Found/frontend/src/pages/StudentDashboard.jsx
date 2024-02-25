import React from "react";
import HeaderStudent from "../components/HeaderStudent";
import { IoAddCircleOutline } from "react-icons/io5";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { RiEmotionHappyLine } from "react-icons/ri";
import { Link } from "react-router-dom";

import { useEffect, useState } from "react";
import axios from "axios";
// import { useNavigate } from "react-router-dom";

import ListLostitems from "../pages/ListLostitems";
import FoundItems from "../pages/FoundItemsStudent";
import MyListing from "../pages/MyListingStudent";

function StudentDashboard() {
  const [userName, setUser] = useState("null");

  const [founditems, setFounditems] = useState(true);
  const [listlostitems, setlistlostitems] = useState(false);
  const [mylisting, setmylisting] = useState(false);
  // const [profilePicture, setProfilePicture] = useState();

  // const navigate = useNavigate();
  useEffect(() => {
    axios
      .get("http://localhost:8000/student/dashboard", {
        withCredentials: true,
      })
      .then((response) => {});
    axios
      .get("http://localhost:8000/student/getme", {
        withCredentials: true,
      })
      .then((response) => {
        setUser(response.data.userName);
        // setProfilePicture(response.data.profilePicture);
      });
  });

  return (
    <>
      {
        <div className="d-main">
          <div className="Header-in-page">
            <HeaderStudent />
          </div>
          <div className="below-part">
            <div className="slidebar">
              <div className="navbar">
                <div className="navbar-inner">
                  <div className="user">
                    {/* <img
                      className="user-profile-photo"
                      src={profilePicture}
                      alt="User Profile"
                    /> */}
                    <FontAwesomeIcon
                      icon={faUserCircle}
                      className="user-icon"
                    />
                    <div className="user-name">{userName}</div>
                  </div>
                  <div className="nav-menu">
                    <ul className="nav-menu-items ">
                      <li className="nav-text">
                        <Link
                          to="#"
                          className="sidebar-text"
                          onClick={() => {
                            setFounditems(true);
                            setlistlostitems(false);
                            setmylisting(false);
                          }}
                        >
                          <RiEmotionHappyLine className="icon" />
                          <span>Found Items</span>
                        </Link>
                      </li>
                      <li className="nav-text">
                        <Link
                          to="#"
                          className="sidebar-text"
                          onClick={() => {
                            setFounditems(false);
                            setlistlostitems(true);
                            setmylisting(false);
                          }}
                        >
                          <IoAddCircleOutline className="icon" />
                          <span>List lost item</span>
                        </Link>
                      </li>
                      <li className="nav-text">
                        <Link
                          to="#"
                          className="sidebar-text"
                          onClick={() => {
                            setFounditems(false);
                            setlistlostitems(false);
                            setmylisting(true);
                          }}
                        >
                          <IoAddCircleOutline className="icon" />
                          <span>My Listing</span>
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="d-right">
              {listlostitems ? <ListLostitems /> : <></>}
              {founditems ? <FoundItems /> : <></>}
              {mylisting ? <MyListing /> : <></>}
            </div>
            <div className="below-right"></div>
          </div>
        </div>
      }
    </>
  );
}

export default StudentDashboard;
