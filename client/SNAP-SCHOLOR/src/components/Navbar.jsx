import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../allcss/navbar.css";
import Footer from "./Footer";

function Navbar() {
  const [user, setUser] = useState(false);
  const navigate = useNavigate();

  const handeluseremail = async () => {
    try {
      const ask = await fetch("http://localhost:5000/api/getuserdetails", {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      if (!ask.ok) {
        setUser(false);
        return;
      }

      const data = await ask.json();
      if (data && data.email) {
        setUser(true); // user exists
      } else {
        setUser(false);
      }
    } catch (error) {
      console.log(error);
      setUser(false);
    }
  };

  useEffect(() => {
    handeluseremail();
  }, []);

  return (
    <>
      <div className="maincontainer">
        <div className="brand">SNAP SCHOLOR</div>
        <div className="slogan">snap it, Learn it, Master it</div>
        <div className="nav-links">
          <Link to="/snapscholor" className="link">Home</Link>
          <Link to="/learn" className="link">Learn</Link>
          <Link to="/quiz" className="link">Quiz</Link>
          <Link to="/snap" className="link">Snap</Link>

          {/* if logged in → show User, else show Signup */}
          {user ? (
            <Link to="/user" className="link">User</Link>
          ) : (
            <Link to="/signup" className="link">Signup</Link>
          )}
        </div>
      </div>
    </>
  );
}

export default Navbar;
