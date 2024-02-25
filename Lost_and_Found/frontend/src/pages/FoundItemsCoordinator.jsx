import React from "react";
import axios from "axios";
import { GrUpdate } from "react-icons/gr";
// import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { BiSearch } from "react-icons/bi";
import { ImCross } from "react-icons/im";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import { ColorRing } from "react-loader-spinner";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
// import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import moment from "moment";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function FoundItemsCoordinator() {
  // const navigate = useNavigate();

  const [count, setCount] = useState(0);
  const [item, setItem] = useState([]); // Set item come from backend
  const [query, setQuery] = useState(""); // Set Query for search
  const [showClearIcon, setShowClearIcon] = useState("none"); // For clear searchFeild
  const [loading, setLoading] = useState(true); // For loading
  const [open, setOpen] = useState(false); // For set dialoge Box
  const [UpdateStatusItem, setUpdateStatusItem] = useState(false); // For set delete item which one is clicked

  // When user click on updatestatus
  const handleClickOpen = () => {
    setOpen(true);
  };

  // When user click on No in dialoge Box
  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    axios
      .all([axios.get(`http://localhost:8000/coordinator/getFoundItems`)])
      .then(
        axios.spread((res1) => {
          const dataWithIndex = res1.data.items.map((itemData, index) => ({
            ...itemData,
            index: index + 1,
          }));
          setItem(dataWithIndex);
        }, setLoading(false))
      );
  }, [count]);

  const ifQueryEmpty = async () => {
    axios
      .all([axios.get(`http://localhost:8000/coordinator/getFoundItems`)])
      .then(
        axios.spread((res1) => {
          const dataWithIndex = res1.data.items.map((itemData, index) => ({
            ...itemData,
            index: index + 1,
          }));
          setItem(dataWithIndex);
        })
      );
  };

  const handleSearch = async () => {
    if (query.length === 0) {
      // handle empty query
      ifQueryEmpty();
      return;
    }
    axios
      .all([
        axios.get(
          `http://localhost:8000/coordinator/getFoundItemsBySearch?q=${query}`
        ),
      ])
      .then(
        axios.spread((res1) => {
          const dataWithIndex = res1.data.items.map((itemData, index) => ({
            ...itemData,
            index: index + 1,
          }));
          setItem(dataWithIndex);
        })
      );
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const HandleUpdate = async (itemData) => {
    setLoading(true);
    await axios
      .post(
        "http://localhost:8000/items/updateStatusOfFoundItems",
        {
          _id: itemData._id,
        },
        { withCredentials: true }
      )
      .then((res) => {
        setCount(count + 1);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <Box
        component="form"
        sx={{
          "& .MuiTextField-root": { m: 1, width: "15ch" },
        }}
        noValidate
        autoComplete="off"
      ></Box>

      <div className="search-area">
        <TextField
          id="outlined-required"
          // label="Search by name"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <BiSearch
                  onClick={handleSearch}
                  className="search-icon hover:scale-125"
                ></BiSearch>{" "}
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end" style={{ display: showClearIcon }}>
                <ImCross
                  style={{ cursor: "pointer" }}
                  onClick={(e) => {
                    setQuery("");
                    setShowClearIcon("none");
                    ifQueryEmpty();
                  }}
                ></ImCross>
              </InputAdornment>
            ),
          }}
          className="search-field"
          placeholder="Search by name.."
          size="small"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowClearIcon(e.target.value === "" ? "none" : "flex");
            handleSearch();
          }}
          onKeyPress={handleKeyPress}
        />
      </div>
      <div className="min-h-screen">
        <div className="table-heading">
          <p className="text-color headings text-3xl">Found Items</p>
        </div>
        {loading ? (
          <div className="loading-1">
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
          <div className="container table">
            <div className="overflow-x-auto">
              <div>
                <div>
                  <div className="shadow-md rounded my-5">
                    <table className="min-w-max bg-white w-full table-auto">
                      <thead>
                        <tr className="border-b bg-gray-200 text-black-600 uppercase text-sm leading-normal">
                          <th className="py-2 px-5 text-center">Index</th>
                          <th className="py-3 px-6 text-center">Item name</th>
                          <th className="py-3 px-6 text-center">Description</th>
                          <th className="py-3 px-6 text-center">Location</th>
                          <th className="py-3 px-6 text-center">Found-Date</th>
                          <th className="py-3 px-6 text-center">Listed By</th>
                          <th className="py-3 px-6 text-center">Listed At</th>
                          <th className="py-3 px-6 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="text-black-600 text-sm font-light">
                        {item.map((itemData) => (
                          <tr className="border-b border-slate-300 bg-gray-50 hover:bg-gray-100 ">
                            <td className="py-3 px-6 text-center">
                              <span className="font-semibold">
                                {itemData.index}
                              </span>
                            </td>
                            <td className="py-3 px-6 text-center">
                              <div className="font-normal">
                                {itemData.itemName}
                              </div>
                            </td>
                            <td className="py-3 px-6 text-center">
                              <div className="font-normal break-normal break-all max-w-[150px]">
                                {itemData.description}
                              </div>
                            </td>
                            <td className="py-3 px-6 text-center">
                              <div className="font-normal">
                                {itemData.location}
                              </div>
                            </td>
                            <td className="py-3 px-6 text-center">
                              <div className="font-normal">
                                {itemData.foundDate}
                              </div>
                            </td>
                            <td className="py-3 px-6 text-center">
                              <div className="font-normal">
                                {itemData.listedBy}
                              </div>
                            </td>
                            <td className="py-3 px-6 text-center">
                              <div className="font-normal">
                                {moment(itemData.ListedAt).format("DD-MM-YYYY")}
                              </div>
                            </td>
                            <td className="py-3 px-6 text-center">
                              <div>
                                <Dialog
                                  open={open}
                                  TransitionComponent={Transition}
                                  onClose={handleClose}
                                  aria-labelledby="alert-dialog-title"
                                  aria-describedby="alert-dialog-description"
                                >
                                  <DialogTitle
                                    id="alert-dialog-title"
                                    style={{ color: "black" }}
                                  >
                                    <div className="warning">
                                      {`Are you sure want to `}
                                      <p
                                        className="warn_text-1"
                                        style={{ color: "red" }}
                                      >
                                        Update status
                                      </p>
                                      <p>of</p>
                                      <p
                                        className="warn_text-2"
                                        style={{ color: "red" }}
                                      >
                                        {UpdateStatusItem.itemName}
                                      </p>{" "}
                                      ?
                                    </div>
                                  </DialogTitle>
                                  <DialogContent>
                                    {/* <DialogContentText id="alert-dialog-description">
                                      Let Google help apps determine location.
                                      This means sending anonymous location data
                                      to Google, even when no apps are running.
                                    </DialogContentText> */}
                                  </DialogContent>
                                  <DialogActions>
                                    <Button onClick={handleClose}>
                                      <p
                                        className="yes_btn"
                                        onClick={() => {
                                          HandleUpdate(UpdateStatusItem);
                                        }}
                                      >
                                        Yes
                                      </p>
                                    </Button>
                                    <Button onClick={handleClose} autoFocus>
                                      <p className="no_btn">No</p>
                                    </Button>
                                  </DialogActions>
                                </Dialog>
                                <GrUpdate
                                  className="table-icons transform hover:scale-110"
                                  style={{ cursor: "pointer" }}
                                  onClick={() => {
                                    setUpdateStatusItem(itemData);
                                    handleClickOpen();
                                  }}
                                ></GrUpdate>
                                <p className="status-text font-normal text-red-600">
                                  {itemData.status}
                                </p>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default FoundItemsCoordinator;
