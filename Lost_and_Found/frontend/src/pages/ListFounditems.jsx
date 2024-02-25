import React from "react";
import { useState, useRef } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
// import { Link } from "react-router-dom";
// import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
// const moment = require("moment");

function ListFounditems() {
  const [itemName, setitemName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [foundDate, setFoundDate] = useState("");
  const dateInputRef = useRef(null);

  // const navigate = useNavigate();

  const handleSubmit = async (event, response) => {
    event.preventDefault();
    if (
      itemName === "" ||
      description === "" ||
      location === "" ||
      foundDate === ""
    ) {
      toast.error("All fields are required");
    } else {
      // make a POST request to the login route on the back-end server

      await axios
        .post(
          "http://localhost:8000/items/storeFounditems",
          {
            itemName: itemName,
            description: description,
            location: location,
            foundDate: foundDate,
          },
          { withCredentials: true }
        )
        .then((response) => {
          toast.success("List Successfully");
        });
    }
  };
  return (
    <div>
      <ToastContainer />
      <div>
        <div className="workspace">
          <div className="add_Co-main-left flex-box">
            <div className="login-title">
              <p>List Found item</p>
              <hr className="line"></hr>
            </div>
            <div className="form">
              <form action="" className="box-grp">
                <h3 className="textfield-title">Item name :</h3>
                <input
                  className="form-box"
                  type="text"
                  name="itemName"
                  placeholder="Enter Item name"
                  value={itemName}
                  onChange={(event) => {
                    setitemName(event.target.value);
                  }}
                ></input>
                <h3 className="textfield-title">Description :</h3>
                <input
                  className="form-box"
                  type="text"
                  name="lastName"
                  placeholder="Enter the Description"
                  value={description}
                  onChange={(event) => {
                    setDescription(event.target.value);
                  }}
                ></input>
                <h3 className="textfield-title">Location :</h3>
                <input
                  className="form-box"
                  type="text"
                  name="location"
                  placeholder="Enter the location where you found"
                  value={location}
                  onChange={(event) => {
                    setLocation(event.target.value);
                  }}
                ></input>
                <h3 className="textfield-title">Found Date :</h3>
                <input
                  className="form-box"
                  type="date"
                  name="date"
                  placeholder="Select found date"
                  value={foundDate}
                  onChange={(event) => {
                    setFoundDate(event.target.value);
                  }}
                  ref={dateInputRef}
                ></input>

                <button
                  type="submit"
                  className="form-box"
                  id="submit-btn"
                  onClick={handleSubmit}
                >
                  List it
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ListFounditems;
