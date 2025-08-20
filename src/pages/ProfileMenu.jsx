// src/pages/ProfileMenu.jsx
import React, { useRef } from "react";
import {
  Avatar,
  Box,
  Button,
  HStack,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { logout } from "../auth"; // your helper that clears token/username

export default function ProfileMenu({ username, avatarUrl }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const hoverZoneRef = useRef(null);

  const goto = (path) => {
    onClose();
    navigate(path);
  };

  return (
    <Box
      ref={hoverZoneRef}
      onMouseEnter={onOpen}
      onMouseLeave={onClose}
      // let users also click to open on mobile/keyboard
    >
      <Menu isOpen={isOpen}>
        <MenuButton
          as={Button}
          variant="ghost"
          p={0}
          _focus={{ boxShadow: "none" }}
          onClick={() => (isOpen ? onClose() : onOpen())}
        >
          <HStack spacing={2}>
            <Avatar size="sm" name={username} src={avatarUrl} />
            <Text display={{ base: "none", md: "block" }} fontWeight="medium">
              {username || "Account"}
            </Text>
          </HStack>
        </MenuButton>

        <MenuList
          onMouseEnter={onOpen}
          onMouseLeave={onClose}
          minW="260px"
          shadow="lg"
        >
          <MenuGroup title="Account">
            <MenuItem onClick={() => goto("/profile")}>View profile</MenuItem>
            <MenuItem onClick={() => goto("/data-page")}>View data dashboard</MenuItem>
          </MenuGroup>

          <MenuDivider />

          <MenuItem
            color="red.500"
            onClick={() => {
              onClose();
              logout();        // clears localStorage + broadcasts change
              navigate("/");   // back to home
            }}
          >
            Sign out
          </MenuItem>
        </MenuList>
      </Menu>
    </Box>
  );
}
