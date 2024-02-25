import React from "react";
import axios from "axios";
import { useState, useRef } from "react";
import { HiFilter } from "react-icons/hi";
// import jsPDF from "jspdf";
// import "jspdf-autotable";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import moment from "moment";
// import { writeFile } from "xlsx";
import * as XLSX from "xlsx";
import { ColorRing } from "react-loader-spinner";

function Summary() {
  const [item, setItem] = useState([]);
  const [filter, setFilter] = useState();
  const [lostItem, setLostItem] = useState(false);
  const [foundItem, setFoundItem] = useState(false);
  const [claimedItem, setClaimedItem] = useState(false);
  const [allItem, setAllItem] = useState(false);
  const [relostItem, resetLostItem] = useState(false);
  const [refoundItem, resetFoundItem] = useState(false);
  const [reclaimedItem, resetClaimedItem] = useState(false);
  const [reallItem, resetAllItem] = useState(true);
  const [duration, setDuration] = useState();
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [manual, setManual] = useState(false);
  const dateInputRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const exportExcel = (itemData) => {
    // const worksheet = XLSX.utils.json_to_sheet(itemData);
    // const workbook = XLSX.utils.book_new();
    // XLSX.utils.book_append_sheet(workbook, worksheet, "Table Data");
    // XLSX.writeFile(workbook, `Summary-${duration}.xlsx`);
    const worksheet = XLSX.utils.json_to_sheet(itemData);

    // Convert the worksheet to an array of arrays
    const aoa = XLSX.utils.sheet_to_json(worksheet, {
      header: 1,
      blankrows: false,
    });

    // Determine the maximum content length for each column
    const colWidths = aoa.reduce((acc, row) => {
      row.forEach((cell, i) => {
        const cellLength = cell ? cell.toString().length : 0;
        if (!acc[i] || cellLength > acc[i]) {
          acc[i] = cellLength;
        }
      });
      return acc;
    }, []);

    // Set the column widths based on the maximum content length
    worksheet["!cols"] = colWidths.map((width) => ({ width }));

    // Set the first row to bold
    worksheet["!rows"] = [{ hpx: 20, bold: true }];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Table Data");
    XLSX.writeFile(workbook, `Summary-${duration}.xlsx`);
  };

  const handleChange = (event) => {
    setFilter(event.target.value);
    if (event.target.value === "Lost Items") {
      setLostItem(true);
      setFoundItem(false);
      setClaimedItem(false);
      setAllItem(false);
    } else if (event.target.value === "Found Items") {
      setLostItem(false);
      setFoundItem(true);
      setClaimedItem(false);
      setAllItem(false);
    } else if (event.target.value === "Claimed Items") {
      setLostItem(false);
      setFoundItem(false);
      setClaimedItem(true);
      setAllItem(false);
    } else {
      setLostItem(false);
      setFoundItem(false);
      setClaimedItem(false);
      setAllItem(true);
    }
  };

  const handleDurationChange = (event) => {
    setDuration(event.target.value);
    if (event.target.value === "Manually") {
      setManual(true);
    } else {
      setManual(false);
    }
  };

  const handleFilter = async (event) => {
    setLoading(true);
    event.preventDefault();
    axios
      .post(`http://localhost:8000/admin/getFilterItems`, {
        filter: filter,
        duration: duration,
        startDate: startDate,
        endDate: endDate,
      })
      .then((res) => {
        console.log(res.data.items);
        const data = res.data.items;
        setItem(data);
        setLoading(false);
      });
    if (lostItem) {
      resetLostItem(true);
      resetFoundItem(false);
      resetClaimedItem(false);
      resetAllItem(false);
    } else if (foundItem) {
      resetLostItem(false);
      resetFoundItem(true);
      resetClaimedItem(false);
      resetAllItem(false);
    } else if (claimedItem) {
      resetLostItem(false);
      resetFoundItem(false);
      resetClaimedItem(true);
      resetAllItem(false);
    } else {
      resetLostItem(false);
      resetFoundItem(false);
      resetClaimedItem(false);
      resetAllItem(true);
    }
  };

  return (
    <>
      <div className="main-filter">
        <div className="inner-filter">
          <HiFilter className="filter-icon"></HiFilter>
          <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth size="small">
              <InputLabel id="demo-simple-select-label">Filter</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={filter}
                label="Filter"
                onChange={handleChange}
              >
                <MenuItem value={"Lost Items"}>Lost Item</MenuItem>
                <MenuItem value={"Found Items"}>Found Item</MenuItem>
                <MenuItem value={"Claimed Items"}>Claimed Item</MenuItem>
                <MenuItem value={"All Items"}>All Item</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <div class="vl"></div>
          <Box className="duration" sx={{ minWidth: 120 }}>
            <FormControl fullWidth size="small">
              <InputLabel id="demo-simple-select-label">Duration</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={duration}
                label="Duration"
                onChange={handleDurationChange}
              >
                <MenuItem value={"All Time"}>All Time</MenuItem>
                <MenuItem value={"This Week"}>This Week</MenuItem>
                <MenuItem value={"Last Week"}>Last Week</MenuItem>
                <MenuItem value={"This Month"}>This Month</MenuItem>
                <MenuItem value={"Last Month"}>Last Month</MenuItem>
                <MenuItem value={"Last 6 Month"}>Last 6 Months</MenuItem>
                <MenuItem value={"This Year"}>This Year</MenuItem>
                <MenuItem value={"Last Year"}>Last Year</MenuItem>
                <MenuItem value={"Manually"}>Select Manually</MenuItem>
              </Select>
            </FormControl>
          </Box>
          {manual ? (
            <div className="manualy_duration">
              <input
                className="duration-box"
                type="date"
                name="date"
                placeholder="Select found date"
                value={startDate}
                max={new Date().toISOString().split("T")[0]}
                onChange={(event) => {
                  // setDuration("");
                  setStartDate(event.target.value);
                }}
                ref={dateInputRef}
              ></input>
              <p>To</p>
              <input
                className="duration-box"
                type="date"
                name="date"
                placeholder="Select found date"
                value={endDate}
                max={new Date().toISOString().split("T")[0]}
                onChange={(event) => {
                  // setDuration("");
                  setEndDate(event.target.value);
                }}
                ref={dateInputRef}
              ></input>
            </div>
          ) : (
            <></>
          )}
          <button className="export-btn" onClick={handleFilter}>
            Apply Filter
          </button>
          {/* <label>
            <DateRangePicker
              ranges={[selectionRange]}
              onChange={handleSelect}
            />
          </label> */}
        </div>
        <button
          className="export-btn"
          onClick={() => {
            exportExcel(item);
          }}
        >
          Export
        </button>
      </div>
      <div className="min-h-screen">
        <div className="table-heading">
          {relostItem ? (
            <p className="text-color headings text-3xl">Lost Item Data</p>
          ) : (
            <></>
          )}
          {refoundItem ? (
            <p className="text-color headings text-3xl">Found Item Data</p>
          ) : (
            <></>
          )}
          {reclaimedItem ? (
            <p className="text-color headings text-3xl">Claimed Item Data</p>
          ) : (
            <></>
          )}
          {reallItem ? (
            <p className="text-color headings text-3xl">All Item Data</p>
          ) : (
            <></>
          )}
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
            <div className="overflow-x-scroll max-w-[1100px]">
              <div>
                <div>
                  <div className="shadow-md rounded my-5">
                    {relostItem ? (
                      <table className="min-w-max bg-white table-auto">
                        <thead>
                          <tr className="border-b bg-gray-200 text-black-600 uppercase text-xs leading-normal">
                            <th className="py-2 px-5 text-center">Index</th>
                            <th
                              className="py-2 px-5 text-center"
                              // onClick={() => handleSort("ItemType")}
                            >
                              Item Type
                            </th>
                            <th className="py-3 px-6 text-center">Item name</th>
                            <th className="py-3 px-6 text-center">
                              Description
                            </th>
                            <th className="py-3 px-6 text-center">Location</th>
                            <th className="py-3 px-6 text-center">Lost-Date</th>
                            <th className="py-3 px-6 text-center">Listed By</th>
                            <th className="py-3 px-6 text-center">Listed At</th>
                            <th className="py-3 px-6 text-center">Status</th>
                          </tr>
                        </thead>
                        <tbody className="text-black-600 text-xs font-light">
                          {item.map((itemData, index) => (
                            <tr className="border-b border-slate-300 bg-gray-50 hover:bg-gray-100 ">
                              <td className="py-3 px-6 text-center">
                                <span className="font-semibold">
                                  {index + 1}
                                </span>
                              </td>
                              <td className="py-3 px-6 text-center">
                                <div className="font-normal">
                                  {itemData.ItemType}
                                </div>
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
                                  {itemData.lostDate}
                                </div>
                              </td>
                              <td className="py-3 px-6 text-center">
                                <div className="font-normal">
                                  {itemData.listedBy}
                                </div>
                              </td>
                              <td className="py-3 px-6 text-center">
                                <div className="font-normal">
                                  {moment(itemData.ListedAt).format(
                                    "DD-MM-YYYY"
                                  )}
                                </div>
                              </td>
                              <td className="py-3 px-6 text-center">
                                <div>
                                  <p className="status-text font-normal text-red-600">
                                    {itemData.status}
                                  </p>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <></>
                    )}
                    {refoundItem ? (
                      <table className="min-w-max bg-white w-full table-auto">
                        <thead>
                          <tr className="border-b bg-gray-200 text-black-600 uppercase text-xs leading-normal">
                            <th className="py-2 px-5 text-center">Index</th>
                            <th className="py-2 px-5 text-center">Item Type</th>
                            <th className="py-3 px-6 text-center">Item name</th>
                            <th className="py-3 px-6 text-center">
                              Description
                            </th>
                            <th className="py-3 px-6 text-center">Location</th>
                            <th className="py-3 px-6 text-center">
                              found-Date
                            </th>
                            <th className="py-3 px-6 text-center">Listed By</th>
                            <th className="py-3 px-6 text-center">Listed At</th>
                            <th className="py-3 px-6 text-center">Status</th>
                          </tr>
                        </thead>
                        <tbody className="text-black-600 text-xs font-light">
                          {item.map((itemData, index) => (
                            <tr className="border-b border-slate-300 bg-gray-50 hover:bg-gray-100 ">
                              <td className="py-3 px-6 text-center">
                                <span className="font-semibold">
                                  {index + 1}
                                </span>
                              </td>
                              <td className="py-3 px-6 text-center">
                                <div className="font-normal">
                                  {itemData.ItemType}
                                </div>
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
                                  {moment(itemData.ListedAt).format(
                                    "DD-MM-YYYY"
                                  )}
                                </div>
                              </td>
                              <td className="py-3 px-6 text-center">
                                <div>
                                  <p className="status-text font-normal text-red-600">
                                    {itemData.status}
                                  </p>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <></>
                    )}
                    {reclaimedItem ? (
                      <table className="min-w-max bg-white w-full table-auto">
                        <thead>
                          <tr className="border-b bg-gray-200 text-black-600 uppercase text-xs leading-normal">
                            <th className="py-2 px-5 text-center">Index</th>
                            <th className="py-2 px-5 text-center">Item Type</th>
                            <th className="py-3 px-6 text-center">Item name</th>
                            <th className="py-3 px-6 text-center">
                              Description
                            </th>
                            <th className="py-3 px-6 text-center">Location</th>
                            <th className="py-3 px-6 text-center">Lost-Date</th>
                            <th className="py-3 px-6 text-center">
                              found-Date
                            </th>
                            <th className="py-3 px-6 text-center">Listed By</th>
                            <th className="py-3 px-6 text-center">Listed At</th>
                            <th className="py-3 px-6 text-center">
                              Claimed At
                            </th>
                            <th className="py-3 px-6 text-center">Status</th>
                          </tr>
                        </thead>
                        <tbody className="text-black-600 text-xs font-light">
                          {item.map((itemData, index) => (
                            <tr className="border-b border-slate-300 bg-gray-50 hover:bg-gray-100 ">
                              <td className="py-3 px-6 text-center">
                                <span className="font-semibold">
                                  {index + 1}
                                </span>
                              </td>
                              <td className="py-3 px-6 text-center">
                                <div className="font-normal">
                                  {itemData.ItemType}
                                </div>
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
                                  {itemData.lostDate}
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
                                  {moment(itemData.ListedAt).format(
                                    "DD-MM-YYYY"
                                  )}
                                </div>
                              </td>
                              <td className="py-3 px-6 text-center">
                                <div className="font-normal">
                                  {moment(itemData.claimedAt).format(
                                    "DD-MM-YYYY"
                                  )}
                                </div>
                              </td>
                              <td className="py-3 px-6 text-center">
                                <div>
                                  <p className="status-text font-normal text-red-600">
                                    {itemData.status}
                                  </p>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <></>
                    )}
                    {reallItem ? (
                      <table className="min-w-max bg-white w-full table-auto">
                        <thead>
                          <tr className="border-b bg-gray-200 text-black-600 uppercase text-xs leading-normal">
                            <th className="py-2 px-5 text-center">Index</th>
                            <th className="py-2 px-5 text-center">Item Type</th>
                            <th className="py-3 px-6 text-center">Item name</th>
                            <th className="py-3 px-6 text-center">
                              Description
                            </th>
                            <th className="py-3 px-6 text-center">Location</th>
                            <th className="py-3 px-6 text-center">Lost-Date</th>
                            <th className="py-3 px-6 text-center">
                              found-Date
                            </th>
                            <th className="py-3 px-6 text-center">Listed By</th>
                            <th className="py-3 px-6 text-center">Listed At</th>
                            <th className="py-3 px-6 text-center">Status</th>
                          </tr>
                        </thead>
                        <tbody className="text-black-600 text-xs font-light">
                          {item.map((itemData, index) => (
                            <tr className="border-b border-slate-300 bg-gray-50 hover:bg-gray-100 ">
                              <td className="py-3 px-6 text-center">
                                <span className="font-semibold">
                                  {index + 1}
                                </span>
                              </td>
                              <td className="py-3 px-6 text-center">
                                <div className="font-normal">
                                  {itemData.ItemType}
                                </div>
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
                                  {itemData.lostDate}
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
                                  {moment(itemData.ListedAt).format(
                                    "DD-MM-YYYY"
                                  )}
                                </div>
                              </td>
                              <td className="py-3 px-6 text-center">
                                <div>
                                  <p className="status-text font-normal text-red-600">
                                    {itemData.status}
                                  </p>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <></>
                    )}
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

export default Summary;
