// src/pages/Register.jsx
import React, { useState } from "react";
import {
  Box, Button, Container, FormControl, FormLabel, FormErrorMessage, Heading,
  Input, InputGroup, InputRightElement, VStack, useToast, Checkbox, Text, Link, HStack
} from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import API from "../api";

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Register() {
  const toast = useToast();
  const navigate = useNavigate();

  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirm: "",
    agree: false,
  });
  const [touched, setTouched] = useState({});
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const errors = {
    username: values.username.trim() ? "" : "Username is required.",
    email: !values.email.trim()
      ? "Email is required."
      : emailRe.test(values.email) ? "" : "Enter a valid email.",
    password: values.password.length >= 8 ? "" : "Password must be at least 8 characters.",
    confirm: values.confirm === values.password ? "" : "Passwords do not match.",
    agree: values.agree ? "" : "You must agree to the terms.",
  };
  const isInvalid = (f) => Boolean(errors[f] && touched[f]);

  const onChange = (e) => {
    const { name, type, checked, value } = e.target;
    setValues((v) => ({ ...v, [name]: type === "checkbox" ? checked : value }));
  };
  const onBlur = (e) => setTouched((t) => ({ ...t, [e.target.name]: true }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ username: true, email: true, password: true, confirm: true, agree: true });
    const errorList = Object.entries(errors)
    .filter(([_, msg]) => Boolean(msg))
    .map(([field, msg]) => `- ${msg}`);
    
    if (errorList.length > 0) {
      toast({
        title: "Please correct the following:",
        description: errorList.join("\n"),
        status: "error",
        duration: 6000,
        isClosable: true,
      });
      return;
    }


    try {
      setSubmitting(true);

      await API.post("api/auth/register", {
        username: values.username.trim(),
        email: values.email.trim(),
        password: values.password,
      });

      // ensure clean auth state (no token yet)
      localStorage.removeItem("token");
      localStorage.removeItem("username");

      toast({
        title: "Account created",
        description: "Please log in to continue.",
        status: "success",
        duration: 4000,
        isClosable: true,
      });

      navigate("/api/auth/login"); // ← go to login after registering
    } catch (err) {
      const serverMsg = err?.response?.data;
      toast({
        title: "Registration error",
        description: serverMsg,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container maxW="lg" py={{ base: 8, md: 12 }}>
      <Heading size="lg" mb={6}>Create an account</Heading>

      <Box as="form" onSubmit={handleSubmit} bg="white" _dark={{ bg: "gray.800" }}
           p={{ base: 5, md: 6 }} borderRadius="xl" boxShadow="md">
        <VStack spacing={5} align="stretch">
          <FormControl isInvalid={isInvalid("username")} isRequired>
            <FormLabel>Username</FormLabel>
            <Input name="username" value={values.username} onChange={onChange} onBlur={onBlur} />
            <FormErrorMessage>{errors.username}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={isInvalid("email")} isRequired>
            <FormLabel>Email</FormLabel>
            <Input type="email" name="email" value={values.email} onChange={onChange} onBlur={onBlur} />
            <FormErrorMessage>{errors.email}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={isInvalid("password")} isRequired>
            <FormLabel>Password</FormLabel>
            <InputGroup>
              <Input
                type={showPw ? "text" : "password"}
                name="password"
                value={values.password}
                onChange={onChange}
                onBlur={onBlur}
                placeholder="At least 8 characters"
              />
              <InputRightElement width="4.5rem">
                <Button variant="ghost" size="sm" onClick={() => setShowPw((s) => !s)}>
                  {showPw ? "Hide" : "Show"}
                </Button>
              </InputRightElement>
            </InputGroup>
            <FormErrorMessage>{errors.password}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={isInvalid("confirm")} isRequired>
            <FormLabel>Confirm Password</FormLabel>
            <InputGroup>
              <Input
                type={showConfirm ? "text" : "password"}
                name="confirm"
                value={values.confirm}
                onChange={onChange}
                onBlur={onBlur}
              />
              <InputRightElement width="4.5rem">
                <Button variant="ghost" size="sm" onClick={() => setShowConfirm((s) => !s)}>
                  {showConfirm ? "Hide" : "Show"}
                </Button>
              </InputRightElement>
            </InputGroup>
            <FormErrorMessage>{errors.confirm}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={isInvalid("agree")}>
            <Checkbox name="agree" isChecked={values.agree} onChange={onChange} onBlur={onBlur}>
              I agree to the Terms and Privacy Policy
            </Checkbox>
            <FormErrorMessage>{errors.agree}</FormErrorMessage>
          </FormControl>

          <Button type="submit" colorScheme="teal" isLoading={submitting} loadingText="Creating account..." alignSelf="flex-start">
            Register
          </Button>

          <HStack justify="space-between" pt={2}>
            <Text fontSize="sm">
              Already have an account?{" "}
              <Link as={RouterLink} to="/login" color="blue.500">Log in</Link>
            </Text>
            <Button variant="outline" size="sm" onClick={() => navigate("/")}>
              Back to Home
            </Button>
          </HStack>
        </VStack>
      </Box>
    </Container>
  );
}
