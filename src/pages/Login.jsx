// src/pages/Login.jsx
import React, { useState } from "react";
import {
  Box, Button, FormControl, FormLabel, Input, Heading,
  FormErrorMessage, VStack, useToast, Text, Link
} from "@chakra-ui/react";
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";

import API from "../api";
import { setToken } from "../auth";

const Login = () => {
  const [username, setUsername] = useState("");   // backend expects username
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const next = params.get("next");


  const validate = () => {
    const e = {};
    if (!username) e.username = "Username is required";
    if (!password) e.password = "Password is required";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length) return;

    try {
      setLoading(true);
      const res = await API.post("api/auth/login", { username, password });

      // ← store auth
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username", res.data.username);
      setToken(res.data.token); // emits "auth-changed"

      toast({
        title: "Hello!",
        description: `Logged in as ${res.data.username}`,
        status: "success",
        duration: 2500,
        isClosable: true,
      });

      navigate(next || "/"); 
    } catch (err) {
      const errorMessage = err?.response?.data;

      let description = "Invalid username or password";

      toast({
        title: "Login failed",
        description,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={10} p={6} borderWidth={1} borderRadius="lg" boxShadow="lg">
      <Heading mb={6} textAlign="center">Log In</Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4} align="stretch">
          <FormControl isInvalid={!!errors.username}>
            <FormLabel>Username</FormLabel>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              autoComplete="username"
            />
            {errors.username && <FormErrorMessage>{errors.username}</FormErrorMessage>}
          </FormControl>

          <FormControl isInvalid={!!errors.password}>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
            />
            {errors.password && <FormErrorMessage>{errors.password}</FormErrorMessage>}
          </FormControl>

          <Button type="submit" colorScheme="blue" width="full" textTransform="uppercase" isLoading={loading}>
            Log In
          </Button>

          <Link as={RouterLink} to="/forgot-password" color="blue.500" fontSize="sm">
            Forgot your password?
          </Link>

          <Link as={RouterLink} to="/" color="blue.500" fontSize="sm">
          Back to Home
          </Link>

          <Text fontSize="sm">
            Don’t have an account?{" "}
            <Link as={RouterLink} to={`/register${location.search}`} color="blue.500">Register here</Link>
          </Text>
        </VStack>
      </form>
    </Box>
  );
};

export default Login;
