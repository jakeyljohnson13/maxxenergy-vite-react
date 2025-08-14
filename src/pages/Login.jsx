// src/pages/Login.jsx
import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
  FormErrorMessage,
  VStack,
  useToast,
  Text,
  Link,
  HStack,
} from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const toast = useToast();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!email) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validate();
    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      try {
        // Example backend POST request
        const res = await fetch("/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        if (!res.ok) {
          toast({
            title: "Login failed",
            description: "Invalid email or password",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
          return;
        }

        // Redirect on success
        navigate("/data");
      } catch (error) {
        toast({
          title: "Error",
          description: "Something went wrong. Try again later.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  return (
    <Box
      maxW="md"
      mx="auto"
      mt={10}
      p={6}
      borderWidth={1}
      borderRadius="lg"
      boxShadow="lg"
    >
      <Heading mb={6} textAlign="center">
        Log In
      </Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl isInvalid={errors.email}>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
            {errors.email && <FormErrorMessage>{errors.email}</FormErrorMessage>}
          </FormControl>

          <FormControl isInvalid={errors.password}>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
            {errors.password && (
              <FormErrorMessage>{errors.password}</FormErrorMessage>
            )}
          </FormControl>

          <Button
            type="submit"
            colorScheme="blue"
            width="full"
            textTransform="uppercase"
          >
            Log In
          </Button>

          {/* Forgot password link */}
          <Link
            as={RouterLink}
            to="/forgot-password"
            color="blue.500"
            fontSize="sm"
          >
            Forgot your password?
          </Link>

          {/* Register link */}
          <Text fontSize="sm">
            Don’t have an account?{" "}
            <Link as={RouterLink} to="/register" color="blue.500">
              Register here
            </Link>
          </Text>

          {/* Back to home */}
          <Button
            variant="outline"
            colorScheme="gray"
            width="full"
            onClick={() => navigate("/")}
          >
            Back to Home
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default Login;
