// src/pages/NavBar.jsx
import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import API from "../api";

const NavBar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const name  = localStorage.getItem("username");

    if (token && name) setUser({ username: name });

    if (token) {
      API.get("/auth/me")
        .then((res) => setUser({ username: res?.data?.username || name || "User" }))
        .catch(() => {
          localStorage.removeItem("token");
          localStorage.removeItem("username");
          setUser(null);
        });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setUser(null);
    navigate("/");
  };

  return (
    <nav>
      <div className="left-links">
        <NavLink to="/" className="navLink">Home</NavLink>
        <NavLink to="/about" className="navLink">About Us</NavLink>
        <NavLink to="/faqs" className="navLink">FAQs</NavLink>
        <NavLink to="/contact" className="navLink">Contact Us</NavLink>
        <NavLink to="/socials" className="navLink">Social Links</NavLink>
        <NavLink to="/profile" className="navLink"><img src="profile.png" width="40" /></NavLink> 
      </div>

      <div className="right-links">
        {user ? (
          
          <>
            
            <span className="navLink">Welcome, <strong>{user.username} </strong></span><strong>| </strong>
            <button onClick={handleLogout} className="navLink"><strong>Logout</strong></button>
          </>
        ) : (
          <>
            <Link to="/login" className="navLink">Log In</Link>
            <Link to="/register" className="navLink">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
