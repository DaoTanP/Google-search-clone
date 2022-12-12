import React from "react";
import "./Home.css";
import { Link } from "react-router-dom";
import AppsIcon from "@material-ui/icons/Apps";
import { Avatar } from "@material-ui/core";
import Search from "../components/Search";

function Home() {
  return (
    <div className="home">
      <div className="home__header">
      </div>
      <div className="home__body">
        <div className="logo-big"></div>

        <div className="home_inputContainer">
          <Search />
        </div>
      </div>
    </div>
  );
}

export default Home;
