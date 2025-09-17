// src/pages/NavBar.jsx
import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Button,
  Box,
  IconButton,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  Stack,
  Divider,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Text,
  useToast
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import API from "../api";
import { setToken } from "../auth";

const NavBar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const toast = useToast();

  // hover control for the left profile icon menu
  const {
    isOpen: isLeftOpen,
    onOpen: onLeftOpen,
    onClose: onLeftClose,
  } = useDisclosure();

    // drawer for mobile
    const mobile = useDisclosure();

    // profile hover (desktop)
    const profileHover = useDisclosure();

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
    if (token) navigate(path);
    else navigate(`/login?next=${encodeURIComponent(path)}`);
  };

  return (
    <>
    {/* STICKY YELLOW BAR */}
    <nav className="nav-sticky">
      {/* LEFT: hamburger (mobile only) */}
      <div className="nav-left">
        <IconButton
          aria-label="Open navigation"
          icon={<HamburgerIcon />}
          variant="ghost"
          onClick={mobile.onOpen}
          className="nav-hamburger"
        />
      </div>

      {/* CENTER: desktop links */}
      <div className="left-links hide-on-mobile">
        <NavLink to="/" className="navLink">Home</NavLink>
        <NavLink to="/about" className="navLink">About Us</NavLink>
        <NavLink to="/faqs" className="navLink">FAQs</NavLink>
        <NavLink to="/contact" className="navLink">Contact Us</NavLink>
        <NavLink to="/socials" className="navLink">Social Links</NavLink>

        {/* profile menu only on desktop */}
        <Menu isOpen={profileHover.isOpen}>
          <Box
            as="span"
            onMouseEnter={profileHover.onOpen}
            onMouseLeave={profileHover.onClose}
            display="inline-block"
            ml="8px"
            >
               <MenuButton as={Button} variant="ghost" px={1} py={1}>
                <img src="profile.png" width="32" alt="profile" />
              </MenuButton>
              <MenuList>
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

        {/* RIGHT: always visible */}
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

      {/* MOBILE DRAWER */}
      <Drawer placement="left" onClose={mobile.onClose} isOpen={mobile.isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            <Text fontWeight="semibold">MAXX Energy</Text>
            <Text fontSize="sm" color="gray.500">
              {user ? `Signed in as ${user.username}` : "Not signed in"}
            </Text>
          </DrawerHeader>
          <DrawerBody>
            <Stack spacing={1}>
              <Button as={NavLink} to="/" variant="ghost" justifyContent="flex-start" onClick={mobile.onClose}>
                Home
              </Button>
              <Button as={NavLink} to="/about" variant="ghost" justifyContent="flex-start" onClick={mobile.onClose}>
                About Us
              </Button>
              <Button as={NavLink} to="/faqs" variant="ghost" justifyContent="flex-start" onClick={mobile.onClose}>
                FAQs
              </Button>
              <Button as={NavLink} to="/contact" variant="ghost" justifyContent="flex-start" onClick={mobile.onClose}>
                Contact Us
              </Button>
              <Button as={NavLink} to="/socials" variant="ghost" justifyContent="flex-start" onClick={mobile.onClose}>
                Social Links
              </Button>

              <Divider my={3} />

              <Button variant="outline" onClick={() => { mobile.onClose(); goProtected("/profile"); }}>
                View Profile
                </Button>
                <Button variant="outline" onClick={() => { mobile.onClose(); goProtected("/data-page"); }}>
                View Data Dashboard
                </Button>
            </Stack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default NavBar;
