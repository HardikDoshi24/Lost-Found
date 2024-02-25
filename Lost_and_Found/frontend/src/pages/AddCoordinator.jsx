import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
// import { Link } from "react-router-dom";
// import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { ColorRing } from "react-loader-spinner";
// import HeaderAdmin from "../components/HeaderAdmin";

function AddCoordinator() {
  const [userName, setuserName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [password, setPassword] = useState("");
  const [conformPassword, setconformPassword] = useState("");
  const [all, setAll] = useState([]);
  const [loading, setLoading] = useState(true);

  // const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:8000/admin/getdept").then((response) => {
      setAll(response.data.depts);
      setLoading(false);
    });
  });

  const handleSubmit = async (event, response) => {
    event.preventDefault();
    if (
      userName === "" ||
      email === "" ||
      department === "" ||
      password === "" ||
      conformPassword === ""
    ) {
      toast.error("All fields are required");
    } else if (password !== conformPassword) {
      toast.error("Password and Confirm Password does not match");
      // } else if (response.data.message === "User alreay exists") {
      //   toast.error("User alreay exists");
    } else {
      // make a POST request to the login route on the back-end server

      await axios
        .post("http://localhost:8000/coordinator/signup", {
          userName: userName,
          email: email,
          department: department,
          password: password,
          conPassword: conformPassword,
        })
        .then((response) => {
          if (response.data.message === "User alreay exists") {
            toast.error("User alreay exists");
          } else {
            toast.success("Password is sent to Coordinator");
          }
        });
    }
  };
  return (
    <div>
      <ToastContainer />
      <div>
        {loading ? (
          <div className="loading">
            <ColorRing
              visible={true}
              height="80"
              width="80"
              ariaLabel="blocks-loading"
              wrapperStyle={{}}
              wrapperClass="blocks-wrapper"
              colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
            />
          </div>
        ) : (
          <div className="workspace">
            <div className="add_Co-main-left flex-box">
              <div className="login-title">
                <p>Add Coordinator</p>
                <hr className="line"></hr>
              </div>
              <div className="form">
                <form action="" className="box-grp">
                  <input
                    className="form-box"
                    type="text"
                    name="userName"
                    placeholder="Enter your User Name"
                    value={userName}
                    onChange={(event) => {
                      setuserName(event.target.value);
                    }}
                  ></input>
                  <input
                    className="form-box"
                    type="text"
                    name="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value);
                    }}
                  ></input>
                  <select
                    className="dropdown"
                    value={department}
                    onChange={(event) => {
                      setDepartment(event.target.value);
                      console.log(event.target.value);
                    }}
                  >
                    {all.map((dept) => (
                      <option>{dept.department}</option>
                    ))}
                  </select>
                  <input
                    className="form-box"
                    type="password"
                    name="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(event) => {
                      setPassword(event.target.value);
                    }}
                  ></input>
                  <input
                    className="form-box"
                    type="password"
                    name="conformPassword"
                    placeholder="Enter password"
                    value={conformPassword}
                    onChange={(event) => {
                      setconformPassword(event.target.value);
                    }}
                  ></input>

                  <button
                    type="submit"
                    className="form-box"
                    id="submit-btn"
                    onClick={handleSubmit}
                  >
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AddCoordinator;
