// src/pages/Register.jsx
import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  useToast,
  Checkbox,
  Text,
  Link,
  HStack,
} from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from "react-router-dom";

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Register() {
  const toast = useToast();
  const navigate = useNavigate();

  const [values, setValues] = useState({
    name: "",
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
    name: values.name.trim() ? "" : "Name is required.",
    email: !values.email.trim()
      ? "Email is required."
      : emailRe.test(values.email)
      ? ""
      : "Enter a valid email.",
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
    setTouched({ name: true, email: true, password: true, confirm: true, agree: true });
    if (Object.values(errors).some(Boolean)) return;

    try {
      setSubmitting(true);
      const baseUrl = import.meta.env.VITE_API_URL || "";
      const res = await fetch(`${baseUrl}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: values.name.trim(),
          email: values.email.trim(),
          password: values.password,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || `Registration failed (${res.status})`);
      }
      toast({
        title: "Account created",
        description: "You can now log in.",
        status: "success",
        duration: 4000,
        isClosable: true,
      });
      navigate("/login");
    } catch (err) {
      toast({
        title: "Registration error",
        description: err.message || "Please try again.",
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

      <Box
        as="form"
        onSubmit={handleSubmit}
        bg="white"
        _dark={{ bg: "gray.800" }}
        p={{ base: 5, md: 6 }}
        borderRadius="xl"
        boxShadow="md"
      >
        <VStack spacing={5} align="stretch">
          <FormControl isInvalid={isInvalid("name")} isRequired>
            <FormLabel>Name</FormLabel>
            <Input name="name" value={values.name} onChange={onChange} onBlur={onBlur} />
            <FormErrorMessage>{errors.name}</FormErrorMessage>
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

          <Button
            type="submit"
            colorScheme="teal"
            isLoading={submitting}
            loadingText="Creating account..."
            alignSelf="flex-start"
          >
            Register
          </Button>

          {/* new: links/secondary actions */}
          <HStack justify="space-between" pt={2}>
            <Text fontSize="sm">
              Already have an account?{" "}
              <Link as={RouterLink} to="/login" color="blue.500">
                Log in
              </Link>
            </Text>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/")}
            >
              Back to Home
            </Button>
          </HStack>
        </VStack>
      </Box>
    </Container>
  );
}
