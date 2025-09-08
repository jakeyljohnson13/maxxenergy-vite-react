// src/pages/NavBar.jsx
import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Menu, MenuButton, MenuList, MenuItem,
  Button, Box, useDisclosure
} from "@chakra-ui/react";
import API from "../api";
import { setToken } from "../auth";

const NavBar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // hover control for the left profile icon menu
  const {
    isOpen: isLeftOpen,
    onOpen: onLeftOpen,
    onClose: onLeftClose,
  } = useDisclosure();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const name = localStorage.getItem("username");

    if (token && name) setUser({ username: name });

    if (token) {
      API.get("api/auth/me")
        .then((res) =>
          setUser({ username: res?.data?.username || name || "User" })
        )
        .catch(() => {
          localStorage.removeItem("token");
          localStorage.removeItem("username");
          setUser(null);
        });
    }
  }, []);

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem("username");
    setUser(null);
    navigate("/");

    toast({
      title: "Goodbye!",
      description: `You have successfully logged out`,
      status: "success",
      duration: 2500,
      isClosable: true,
    });
  };

  // Protected navigation: if not logged in, send to login (with optional ?next=)
  const goProtected = (path) => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate(path);
    } else {
      navigate(`/login?next=${encodeURIComponent(path)}`);
    }
  };

  return (
    <nav>
      <div className="left-links">
        <NavLink to="/" className="navLink">Home</NavLink>
        <NavLink to="/about" className="navLink">About Us</NavLink>
        <NavLink to="/faqs" className="navLink">FAQs</NavLink>
        <NavLink to="/contact" className="navLink">Contact Us</NavLink>
        <NavLink to="/socials" className="navLink">Social Links</NavLink>

        {/* Profile icon that is always visible, with hover menu */}
        <Menu isOpen={isLeftOpen}>
          <Box
            as="span"
            onMouseEnter={onLeftOpen}
            onMouseLeave={onLeftClose}
            display="inline-block"
            ml="8px"
          >
            <MenuButton
              as={Button}
              variant="ghost"
              px={1}
              py={1}
              className="navLink"
              aria-label="Profile menu"
            >
              <img src="profile.png" width="40" alt="profile" />
            </MenuButton>

            <MenuList onMouseEnter={onLeftOpen} onMouseLeave={onLeftClose}>
              <MenuItem onClick={() => goProtected("/profile")}>
                View Profile
              </MenuItem>
              <MenuItem onClick={() => goProtected("/data-page")}>
                View Data Dashboard
              </MenuItem>
            </MenuList>
          </Box>
        </Menu>
      </div>

      <div className="right-links">
        {user ? (
          <>
            <span className="navLink">
              Welcome, <strong>{user.username}</strong>
            </span>
            <strong>&nbsp;|&nbsp;</strong>
            <button onClick={handleLogout} className="navLink">
              <strong>Logout</strong>
            </button>
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
