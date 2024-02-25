import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { BiUserCheck } from "react-icons/bi";
import { IoAddCircleOutline } from "react-icons/io5";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MdOutlineDashboard } from "react-icons/md";
import { AiOutlineFileText } from "react-icons/ai";
import { RiEmotionHappyLine } from "react-icons/ri";
import { RiEmotionUnhappyLine } from "react-icons/ri";

function SideBarAdmin() {
  const [user, setUser] = useState(true);
  const [pending, setPending] = useState(true);
  const [dept, setDept] = useState(false);

  const [value, setValue] = useState("");
  const [all, setAll] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/admin/getdept", { withCredentials: true })
      .then((response) => setAll(response.data.depts));
  });

  const handleDept = async (event) => {
    event.preventDefault();
    await axios
      .post(
        "http://localhost:5000/admin/adddept",
        {
          department: value,
        },
        { withCredentials: true }
      )
      .then((response) => {})
      .catch((error) => {
        console.log("Error is " + error);
      });
  };
  return (
    <div className="navbar">
      <div className="navbar-inner">
        <div className="user">
          <FontAwesomeIcon icon={faUserCircle} className="user-icon" />
          <div className="user-name">Admin</div>
        </div>
        <div className="nav-menu">
          <ul className="nav-menu-items ">
            <li className="nav-text">
              <Link to="#" className="sidebar-text">
                <MdOutlineDashboard className="icon" />
                <span>Dashboard</span>
              </Link>
            </li>
            <li className="nav-text">
              <Link to="#" className="sidebar-text">
                <BiUserCheck className="icon" />
                <span>Active users</span>
              </Link>
            </li>
            <li className="nav-text">
              <Link to="#" className="sidebar-text">
                <RiEmotionUnhappyLine className="icon" />
                <span>Lost Items</span>
              </Link>
            </li>
            <li className="nav-text">
              <Link to="#" className="sidebar-text">
                <RiEmotionHappyLine className="icon" />
                <span>Found Items</span>
              </Link>
            </li>
            <li className="nav-text">
              <Link to="#" className="sidebar-text">
                <IoAddCircleOutline className="icon" />
                <span>Add Coordinator</span>
              </Link>
            </li>
            <li className="nav-text">
              <Link to="#" className="sidebar-text">
                <IoAddCircleOutline className="icon" />
                <span>Add Department</span>
              </Link>
            </li>
            <li className="nav-text">
              <Link to="#" className="sidebar-text">
                <AiOutlineFileText className="icon" />
                <span>Summary</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default SideBarAdmin;
