import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FaBars } from "react-icons/fa";
import { BiUserCheck } from "react-icons/bi";
import { FiUsers } from "react-icons/fi";
import { IoAddCircleOutline } from "react-icons/io5";
import { IconContext } from "react-icons";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MdOutlineDashboard } from "react-icons/md";
import { AiOutlineFileText } from "react-icons/ai";
import { RiEmotionHappyLine } from "react-icons/ri";
import { RiEmotionUnhappyLine } from "react-icons/ri";

function SideBarStudent() {
  const [sidebar, setSidebar] = useState(false);
  const [active, setActive] = useState(false);
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
          <div className="user-name">Student</div>
        </div>
        <div className="nav-menu">
          <ul className="nav-menu-items ">
            <li className="nav-text">
              <Link to="#" className="sidebar-text">
                <RiEmotionHappyLine className="icon" />
                <span>Found Items</span>
              </Link>
            </li>
            <li className="nav-text">
              <Link to="#" className="sidebar-text">
                <IoAddCircleOutline className="icon" />
                <span>List lost item</span>
              </Link>
            </li>
            <li className="nav-text">
              <Link to="#" className="sidebar-text">
                <IoAddCircleOutline className="icon" />
                <span>My Listing</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default SideBarStudent;
