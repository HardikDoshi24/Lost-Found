import { React } from "react";
import BeforeLoginNavbar from "../components/Navbar";

import image from "../Assets/image.png";

export default function Home() {
  return (
    <div>
      <BeforeLoginNavbar />
      <div className="workspace">
        <div className="left-home">
          <div id="top">
            <p className="text-color left-text" id="top-text">
              LOST AND FOUND
            </p>
          </div>
          <div id="middle">
            <p className="text-color left-text" id="left-long-text">
              LOST IT.LIST IT.FOUND IT.
            </p>
          </div>
          <a
            href="http://localhost:3000/selectRole"
            id="down-get-started-btn"
            className="getStartedText"
          >
            Get Started
          </a>
        </div>
        <div className="right-home">
          <img id="image" src={image} alt="" srcSet="" />
        </div>
      </div>
    </div>
  );
}
