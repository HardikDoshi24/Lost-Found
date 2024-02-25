import * as React from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Unstable_Grid2";
import { useState, useEffect } from "react";
import FoundItemIcon from "../Assets/founditem.png";
import LostItemLogo from "../Assets/lostitem.png";
import Alluser from "../Assets/totaluser.png";
import Items from "../Assets/items.png";
import ClaimedItem from "../Assets/claimed items.png";
import { ColorRing } from "react-loader-spinner";

function DashAdmin() {
  const [totalUsers, setTotalUsers] = useState("");
  const [totalClaimedItems, setTotalClaimedItems] = useState("");
  const [totalLostAndFoundItems, setTotalLostAndFoundItem] = useState("");
  const [totalFoundItems, setTotalFoundItems] = useState("");
  const [totalLostItems, setTotalLostItem] = useState("");
  const [totalCurrentLostandFoundItems, setTotalCurrentLostAndFoundItems] =
    useState("");
  const [totalCurrentFoundedItems, setTotalCurrentFoundedItems] = useState("");
  const [totalCurrentLostItems, setTotalCurrentLostItems] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`http://localhost:8000/admin/dash`).then((response) => {
      setTotalUsers(response.data.totalUsers);
      setTotalClaimedItems(response.data.totalClaimedItems);
      setTotalLostAndFoundItem(response.data.totalLostAndFoundItems);
      setTotalFoundItems(response.data.totalFoundItems);
      setTotalLostItem(response.data.totalLostItems);
      setTotalCurrentLostAndFoundItems(
        response.data.totalCurrentLostandFoundItems
      );
      setTotalCurrentFoundedItems(response.data.totalCurrentFoundedItems);
      setTotalCurrentLostItems(response.data.totalCurrentLostItems);
      setLoading(false);
    });
  });

  return (
    <>
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
        <div>
          <div className="main-dashboard">
            <div className="inner-dash">
              <Box sx={{ flexGrow: 1 }}>
                <Grid className="dash" container spacing={14}>
                  <Grid xs={3}>
                    <div className="count-box1">
                      <div className="inner-count-box">
                        <div className="above-inner-box">
                          <div className="count-val">{totalUsers}</div>
                          <img
                            className="dasd-img"
                            src={Alluser}
                            alt="Found item"
                          />
                        </div>
                        <div className="below-inner-box">
                          <div className="box-title">Total Users</div>
                        </div>
                      </div>
                    </div>
                  </Grid>
                  <Grid xs={3}>
                    <div className="count-box2">
                      <div className="inner-count-box">
                        <div className="above-inner-box">
                          <div className="count-val">{totalClaimedItems}</div>
                          <img
                            className="dasd-img1"
                            src={ClaimedItem}
                            alt="Found item"
                          />
                        </div>
                        <div className="below-inner-box">
                          <div className="box-title">Total</div>
                          <div className="box-title">Claimed items</div>
                        </div>
                      </div>
                    </div>
                  </Grid>
                  <Grid xs={3}>
                    <div className="count-box1">
                      <div className="inner-count-box">
                        <div className="above-inner-box">
                          <div className="count-val">
                            {totalLostAndFoundItems}
                          </div>
                          <img
                            className="dasd-img1"
                            src={Items}
                            alt="Found item"
                          />
                        </div>
                        <div className="below-inner-box">
                          <div className="box-title">Total Items</div>
                        </div>
                      </div>
                    </div>
                  </Grid>
                  <Grid xs={3}>
                    <div className="count-box2">
                      <div className="inner-count-box">
                        <div className="above-inner-box">
                          <div className="count-val">
                            {totalCurrentLostandFoundItems}
                          </div>
                          <img
                            className="dasd-img1"
                            src={Items}
                            alt="Found item"
                          />
                        </div>
                        <div className="below-inner-box">
                          <div className="box-title">Total current</div>
                          <div className="box-title">lost and found items</div>
                        </div>
                      </div>
                    </div>
                  </Grid>
                  <Grid xs={3}>
                    <div className="count-box1">
                      <div className="inner-count-box">
                        <div className="above-inner-box">
                          <div className="count-val">{totalLostItems}</div>
                          <img
                            className="dasd-img"
                            src={LostItemLogo}
                            alt="Found item"
                          />
                        </div>
                        <div className="below-inner-box">
                          <div className="box-title">Total</div>
                          <div className="box-title">Lost items</div>
                        </div>
                      </div>
                    </div>
                  </Grid>
                  <Grid xs={3}>
                    <div className="count-box2">
                      <div className="inner-count-box">
                        <div className="above-inner-box">
                          <div className="count-val">{totalFoundItems}</div>
                          <img
                            className="dasd-img"
                            src={FoundItemIcon}
                            alt="Found item"
                          />
                        </div>
                        <div className="below-inner-box">
                          <div className="box-title">Total</div>
                          <div className="box-title">Found items</div>
                        </div>
                      </div>
                    </div>
                  </Grid>
                  <Grid xs={3}>
                    <div className="count-box1">
                      <div className="inner-count-box">
                        <div className="above-inner-box">
                          <div className="count-val">
                            {totalCurrentLostItems}
                          </div>
                          <img
                            className="dasd-img"
                            src={LostItemLogo}
                            alt="Lost item"
                          />
                        </div>
                        <div className="below-inner-box">
                          <div className="box-title">Current</div>
                          <div className="box-title">Lost items</div>
                        </div>
                      </div>
                    </div>
                  </Grid>
                  <Grid xs={3}>
                    <div className="count-box2">
                      <div className="inner-count-box">
                        <div className="above-inner-box">
                          <div className="count-val">
                            {totalCurrentFoundedItems}
                          </div>
                          <img
                            className="dasd-img"
                            src={FoundItemIcon}
                            alt="Found item"
                          />
                        </div>
                        <div className="below-inner-box">
                          <div className="box-title">Current</div>
                          <div className="box-title">Found items</div>
                        </div>
                      </div>
                    </div>
                  </Grid>
                </Grid>
              </Box>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default DashAdmin;
