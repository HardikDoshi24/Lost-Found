import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import HeaderAdmin from "../components/HeaderAdmin";
import { TiDelete } from "react-icons/ti";
import AllUser from "./Alluser";
import AddCoordinator from "../pages/AddCoordinator";
import FoundItemsAdmin from "../pages/FoundItemsAdmin";
import LostItems from "../pages/LostItemsAdmin";
import Dasboard from "../pages/DashAdmin";
import Summary from "../pages/Summary";
import ClaimedItemsAdmin from "../pages/ClaimedItemsAdmin";
import { BiUserCheck } from "react-icons/bi";
import { FaHandshake } from "react-icons/fa";
import { IoAddCircleOutline } from "react-icons/io5";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MdOutlineDashboard } from "react-icons/md";
import { AiOutlineFileText } from "react-icons/ai";
import { RiEmotionHappyLine } from "react-icons/ri";
import { RiEmotionUnhappyLine } from "react-icons/ri";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// import { styled } from "@mui/material/styles";
// import Box from "@mui/material/Box";
// import Paper from "@mui/material/Paper";
// import Grid from "@mui/material/Unstable_Grid2";

// const Item = styled(Paper)(({ theme }) => ({
//   backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
//   ...theme.typography.body2,
//   padding: theme.spacing(1),
//   textAlign: "center",
//   color: theme.palette.text.secondary,
// }));

export default function AdminDashboard() {
  const [dashboard, setDashboard] = useState(true);
  const [user, setUser] = useState(false);
  const [founditems, setfounditems] = useState(false);
  const [lostitems, setlostitems] = useState(false);
  const [claimeditems, setClaimeditems] = useState(false);
  const [addCoordinator, setAddCoordinator] = useState(false);
  const [addDept, setAddDept] = useState(false);
  const [summary, setSummary] = useState(false);

  const [dept, setDept] = useState("");
  const [all, setAll] = useState([]);

  const navigate = useNavigate();
  useEffect(() => {
    axios
      .get("http://localhost:8000/admin/dashboard", {
        withCredentials: true,
      })
      .then((response) => {})
      .catch((err) => navigate("/admin/login"));
    axios
      .get("http://localhost:8000/admin/getdept", { withCredentials: true })
      .then((response) => setAll(response.data.depts));
  });

  const handleDept = async (event) => {
    event.preventDefault();
    await axios
      .post(
        "http://localhost:8000/admin/adddept",
        {
          department: dept,
        },
        { withCredentials: true }
      )
      .then((response) => {
        if (response.data.message === "Department already Exists") {
          toast.error("Coordinator already exists");
        }
      })
      .catch((error) => {
        console.log("Error is " + error);
      });
  };
  const deptDelete = async (event, department) => {
    event.preventDefault();
    await axios
      .post("http://localhost:8000/admin/deletedept", {
        department: department,
      })
      .then((res) => {
        // window.location.reload("admin/dashboard");
      })
      .catch((err) => {
        // window.location.reload("admin/dashboard");
      });
  };

  return (
    <>
      <div className="d-main">
        <div className="header-in-page">
          <div>
            <HeaderAdmin />
          </div>
        </div>
        {/* <Box sx={{ display: "flex", flexDirection: "row", flexWrap: "nowrap" }}>
          <Grid container spacing={6}>
            <Grid> */}
        <div className="below-part">
          <div className="slidebar">
            <div className="navbar">
              <div className="navbar-inner">
                <div className="user">
                  <FontAwesomeIcon icon={faUserCircle} className="user-icon" />
                  <div className="user-name">Admin</div>
                </div>
                <div className="nav-menu">
                  <ul className="nav-menu-items ">
                    <li className="nav-text">
                      <Link
                        to="#"
                        className="sidebar-text"
                        onClick={() => {
                          setDashboard(true);
                          setUser(false);
                          setfounditems(false);
                          setlostitems(false);
                          setClaimeditems(false);
                          setAddCoordinator(false);
                          setAddDept(false);
                          setSummary(false);
                        }}
                      >
                        <MdOutlineDashboard className="icon" />
                        <span>Dashboard</span>
                      </Link>
                    </li>
                    <li className="nav-text">
                      <Link
                        to="#"
                        className="sidebar-text"
                        onClick={() => {
                          setDashboard(false);
                          setUser(true);
                          setfounditems(false);
                          setlostitems(false);
                          setClaimeditems(false);
                          setAddCoordinator(false);
                          setAddDept(false);
                          setSummary(false);
                        }}
                      >
                        <BiUserCheck className="icon" />
                        <span>Active users</span>
                      </Link>
                    </li>
                    <li className="nav-text">
                      <Link
                        to="#"
                        className="sidebar-text"
                        onClick={() => {
                          setDashboard(false);
                          setUser(false);
                          setfounditems(false);
                          setlostitems(true);
                          setClaimeditems(false);
                          setAddCoordinator(false);
                          setAddDept(false);
                          setSummary(false);
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
                          setDashboard(false);
                          setUser(false);
                          setfounditems(true);
                          setlostitems(false);
                          setClaimeditems(false);
                          setAddCoordinator(false);
                          setAddDept(false);
                          setSummary(false);
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
                          setDashboard(false);
                          setUser(false);
                          setfounditems(false);
                          setlostitems(false);
                          setClaimeditems(true);
                          setAddCoordinator(false);
                          setAddDept(false);
                          setSummary(false);
                        }}
                      >
                        <FaHandshake className="icon" />
                        <span>Claimed Items</span>
                      </Link>
                    </li>
                    <li className="nav-text">
                      <Link
                        to="#"
                        className="sidebar-text"
                        onClick={() => {
                          setDashboard(false);
                          setUser(false);
                          setfounditems(false);
                          setlostitems(false);
                          setClaimeditems(false);
                          setAddCoordinator(true);
                          setAddDept(false);
                          setSummary(false);
                        }}
                      >
                        <IoAddCircleOutline className="icon" />
                        <span>Add Coordinator</span>
                      </Link>
                    </li>
                    <li className="nav-text">
                      <Link
                        to="#"
                        className="sidebar-text"
                        onClick={() => {
                          setDashboard(false);
                          setUser(false);
                          setfounditems(false);
                          setlostitems(false);
                          setClaimeditems(false);
                          setAddCoordinator(false);
                          setAddDept(true);
                          setSummary(false);
                        }}
                      >
                        <IoAddCircleOutline className="icon" />
                        <span>Add Department</span>
                      </Link>
                    </li>
                    <li className="nav-text">
                      <Link
                        to="#"
                        className="sidebar-text"
                        onClick={() => {
                          setDashboard(false);
                          setUser(false);
                          setfounditems(false);
                          setlostitems(false);
                          setClaimeditems(false);
                          setAddCoordinator(false);
                          setAddDept(false);
                          setSummary(true);
                        }}
                      >
                        <AiOutlineFileText className="icon" />
                        <span>Summary</span>
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          {/* </Grid>
            <Grid sx={12}> */}
          <div className="d-right">
            {user ? <AllUser /> : <></>}
            {addCoordinator ? <AddCoordinator /> : <></>}
            {founditems ? <FoundItemsAdmin /> : <></>}
            {lostitems ? <LostItems /> : <></>}
            {claimeditems ? <ClaimedItemsAdmin /> : <></>}
            {dashboard ? <Dasboard /> : <></>}
            {summary ? <Summary /> : <></>}
            {addDept ? (
              <>
                <div>
                  <ToastContainer />
                  <div className="add-dep">
                    <div className="add-dep-in">
                      <div className="add_dep-main-left flex-box">
                        <div className="login-title">
                          <p>Add Department</p>
                          <hr className="line"></hr>
                        </div>
                        <div className="form">
                          <form action="" className="box-grp">
                            <input
                              className="form-box"
                              type="text"
                              name="dept"
                              placeholder="Enter department"
                              value={dept}
                              onChange={(event) => {
                                setDept(event.target.value);
                              }}
                            ></input>
                            <button
                              type="submit"
                              className="form-box"
                              id="submit-btn"
                              onClick={handleDept}
                            >
                              Add Department
                            </button>
                          </form>
                        </div>
                      </div>
                    </div>
                    <div className="add-dep-in">
                      <div className="add_dep-main-right flex-box">
                        <div className="login-title">
                          <p>All Department</p>
                          <hr className="line"></hr>
                        </div>
                        <div className="box-inner">
                          {all.map((dept) => (
                            <>
                              <div className="flex-row">
                                <div>{dept.department}</div>
                                <span>
                                  <TiDelete
                                    className="cros-icon "
                                    style={{ cursor: "pointer" }}
                                    size={20}
                                    onClick={(event) =>
                                      deptDelete(event, dept.department)
                                    }
                                  />
                                </span>
                              </div>
                            </>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <></>
            )}
          </div>
        </div>
        {/* </Grid>
          </Grid>
        </Box> */}
      </div>
    </>
  );
}
