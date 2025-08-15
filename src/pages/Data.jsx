// src/pages/Data.jsx
import React, { useEffect, useState } from "react";
import API from "../api";
import { Box, Heading, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export default function Data() {
  const [user, setUser] = useState(null);
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/auth/me")
      .then((res) => setUser(res.data))
      .catch((e) => {
        if (e?.response?.status === 401) {
          navigate("/login");
        } else {
          setErr("Failed to load profile");
          console.error(e);
        }
      });
  }, [navigate]);

  return (
    <Box maxW="lg" mx="auto" mt={10}>
      <Heading mb={4}>My Account</Heading>
      {err && <Text color="red.400">{err}</Text>}
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </Box>
  );
}
