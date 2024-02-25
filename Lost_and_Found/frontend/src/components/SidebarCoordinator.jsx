import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { IoAddCircleOutline } from "react-icons/io5";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { RiEmotionHappyLine } from "react-icons/ri";
import { RiEmotionUnhappyLine } from "react-icons/ri";
import { BsListUl } from "react-icons/bs";

function SideBarCoordinator() {
  const [firstName, setfirstNmae] = useState("");

  const [lostitems, setlostitems] = useState(true);
  const [lostifounditemsrems, setfounditems] = useState(false);
  const [listlostitem, setlistlostitem] = useState(false);
  const [mylisting, setmylisting] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:8000/coordinator/getme", {
        withCredentials: true,
      })
      .then((response) => {
        setfirstNmae(response.data.firstName);
      });
  });

  return (
    <div className="navbar">
      <div className="navbar-inner">
        <div className="user">
          <FontAwesomeIcon icon={faUserCircle} className="user-icon" />
          <div className="user-name">Coordinator</div>
        </div>
        <div className="nav-menu">
          <ul className="nav-menu-items ">
            <li className="nav-text">
              <Link
                to="#"
                className="sidebar-text"
                onClick={() => {
                  setlostitems(true);
                  setfounditems(false);
                  setlistlostitem(false);
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
                  setlistlostitem(false);
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
                  setlistlostitem(true);
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
                  setlistlostitem(false);
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
  );
}

export default SideBarCoordinator;
