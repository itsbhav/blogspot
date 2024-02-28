import React,{memo} from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="footer">
      <div className="footer-div">
        Join The Blogging Community <Link to="/login">Login</Link>
      </div>
    </div>
  );
};

export default memo(Footer);
