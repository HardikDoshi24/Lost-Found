import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import HeaderCoordinator from "../components/HeaderCoordinator";
import { IoAddCircleOutline } from "react-icons/io5";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { RiEmotionHappyLine } from "react-icons/ri";
import { RiEmotionUnhappyLine } from "react-icons/ri";
import { BsListUl } from "react-icons/bs";

import LostItems from "../pages/LostItemsCoordinator";
import FoundItems from "../pages/FoundItemsCoordinator";
import MyListing from "../pages/MyListingCoordinator";

import ListFounditems from "./ListFounditems";

function CoordinatorDashboard() {
  const [userName, setUser] = useState("null");

  const [lostitems, setlostitems] = useState(true);
  const [founditems, setfounditems] = useState(false);
  const [listfounditems, setlistfounditems] = useState(false);
  const [mylisting, setmylisting] = useState(false);

  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("picture", selectedFile);

    await axios.post("/api/upload-profile-picture", formData);
  };

  useEffect(() => {
    axios
      .get("http://localhost:8000/coordinator/dashboard", {
        withCredentials: true,
      })
      .then((response) => {})
      .catch((err) => navigate("/coordinator/login"));
    axios
      .get("http://localhost:8000/coordinator/getme", {
        withCredentials: true,
      })
      .then((response) => {
        setUser(response.data.userName);
      });
    // fetch("http://localhost:8000/coordinator/getme")
    //   .then((res) => res.json())
    //   .then((data) => setUserName(data.userName))sss
    //   .catch((err) => console.log(err));
  });

  return (
    <>
      {
        <div className="d-main">
          <div className="Header-in-page">
            <HeaderCoordinator />
          </div>
          <div className="below-part">
            <div className="slidebar">
              <div className="navbar">
                <div className="navbar-inner">
                  <div className="user">
                    <FontAwesomeIcon
                      icon={faUserCircle}
                      className="user-icon"
                    />
                    <div className="user-name">{userName}</div>
                  </div>
                  {/* <div>
                    <img src={currentPictureUrl} alt="Profile" />
                    <input type="file" onChange={handleFileUpload} />
                    <button onClick={handleUploadButtonClick}>
                      Update Profile Picture
                    </button>
                  </div> */}
                  <div className="nav-menu">
                    <ul className="nav-menu-items ">
                      <li className="nav-text">
                        <Link
                          to="#"
                          className="sidebar-text"
                          onClick={() => {
                            setlostitems(true);
                            setfounditems(false);
                            setlistfounditems(false);
                            setmylisting(false);
                          }}
                        >
                          <RiEmotionUnhappyLine className="icon" />
                          <span>Lost Items</span>
                        </Link>
                      </li>
                      <li className="nav-text">
                        <Link
                          to="#"
                          className="sidebar-text"
                          onClick={() => {
                            setlostitems(false);
                            setfounditems(true);
                            setlistfounditems(false);
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
                            setlostitems(false);
                            setfounditems(false);
                            setlistfounditems(true);
                            setmylisting(false);
                          }}
                        >
                          <IoAddCircleOutline className="icon" />
                          <span>List Found item</span>
                        </Link>
                      </li>
                      <li className="nav-text">
                        <Link
                          to="#"
                          className="sidebar-text"
                          onClick={() => {
                            setlostitems(false);
                            setfounditems(false);
                            setlistfounditems(false);
                            setmylisting(true);
                          }}
                        >
                          <BsListUl className="icon" />
                          <span>My Listing</span>
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="d-right">
              {listfounditems ? <ListFounditems /> : <></>}
              {lostitems ? <LostItems /> : <></>}
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

export default CoordinatorDashboard;
