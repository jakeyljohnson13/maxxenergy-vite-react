// src/pages/Profile.jsx
import React, { useEffect, useState } from "react";
import {
  Box, Heading, FormControl, FormLabel, Input, Button,
  Avatar, HStack, VStack, Text, useToast, Code
} from "@chakra-ui/react";
import API from "../api";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [username, setUsername] = useState("");
  const [email,    setEmail]    = useState("");
  const [role,     setRole]     = useState("");
  const [avatarPreview, setAvatarPreview] = useState(null);   // frontend preview only
  const [hash, setHash] = useState(null);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // load profile
    API.get("/users/me")
      .then(res => {
        setUsername(res.data.username);
        setEmail(res.data.email || "");
        setRole(res.data.role || "");
      })
      .catch(err => {
        if (err?.response?.status === 401) navigate("/login");
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  const onAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setAvatarPreview(url);               // for now only preview in UI
    // If/when you support upload, convert to base64 or FormData and send to backend
  };

  const save = async () => {
    try {
      setSaving(true);
      // Update editable fields (email; username typically immutable)
      const { data } = await API.put("/users/me", { email });
      toast({ title: "Profile updated", status: "success", duration: 2000, isClosable: true });

      // keep navbar greeting up to date (if username changed in future)
      if (data.username) {
        localStorage.setItem("username", data.username);
      }
    } catch (err) {
      toast({
        title: "Update failed",
        description: err?.response?.data || "Please try again",
        status: "error",
        duration: 3000,
        isClosable: true
      });
    } finally {
      setSaving(false);
    }
  };

  const revealHash = async () => {
    try {
      const { data } = await API.get("/users/me/hash"); // DEV-ONLY endpoint
      setHash(data.hash);
    } catch {
      toast({
        title: "Cannot fetch hash",
        description: "Endpoint disabled or unauthorized",
        status: "warning",
        duration: 2500,
        isClosable: true
      });
    }
  };

  if (loading) return <Box p={8}><Text>Loading...</Text></Box>;

  return (
    <Box maxW="lg" mx="auto" p={6}>
      <Heading mb={6}>User Profile</Heading>

      <HStack spacing={6} mb={6} align="center">
        <Avatar name={username} src={avatarPreview || undefined} size="xl" />
        <div>
          <input type="file" accept="image/*" onChange={onAvatarChange} />
          <Text fontSize="sm" color="gray.500">Image preview only (not uploaded yet)</Text>
        </div>
      </HStack>

      <VStack align="stretch" spacing={4}>
        <FormControl>
          <FormLabel>Username</FormLabel>
          <Input value={username} isDisabled />
        </FormControl>

        <FormControl>
          <FormLabel>Email</FormLabel>
          <Input value={email} onChange={(e)=>setEmail(e.target.value)} />
        </FormControl>

        <FormControl>
          <FormLabel>Role</FormLabel>
          <Input value={role} isDisabled />
        </FormControl>

        <FormControl>
          <FormLabel>Password (hashed)</FormLabel>
          {hash ? (
            <Code p={2} display="block" overflowX="auto">{hash}</Code>
          ) : (
            <Button onClick={revealHash} variant="outline">Reveal hash (DEV only)</Button>
          )}
        </FormControl>

        <HStack>
          <Button colorScheme="teal" onClick={save} isLoading={saving}>Save changes</Button>
          <Button variant="ghost" onClick={()=>navigate("/")}>Back</Button>
        </HStack>
      </VStack>
    </Box>
  );
}
