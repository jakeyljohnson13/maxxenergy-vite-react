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
  VStack,
  Text,
  Link,
  useToast,
} from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from "react-router-dom";

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const error =
    !email && touched
      ? "Email is required."
      : touched && !emailRe.test(email)
      ? "Enter a valid email."
      : "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched(true);
    if (error) return;

    try {
      setSubmitting(true);
      const baseUrl = import.meta.env.VITE_API_URL || "";
      const res = await fetch(`${baseUrl}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: email.trim() }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || `Request failed (${res.status})`);
      }

      toast({
        title: "Email sent",
        description: "If that email exists, we just sent a reset link.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      // Optional: route to login
      navigate("/api/auth/login");
    } catch (err) {
      toast({
        title: "Unable to send email",
        description: err.message || "Please try again later.",
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
      <Heading size="lg" mb={6}>Forgot your password?</Heading>

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
          <FormControl isInvalid={Boolean(error)}>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setTouched(true)}
              placeholder="you@example.com"
              autoComplete="email"
            />
            <FormErrorMessage>{error}</FormErrorMessage>
          </FormControl>

          <Button
            type="submit"
            colorScheme="teal"
            isLoading={submitting}
            loadingText="Sending..."
            alignSelf="flex-start"
          >
            Send reset link
          </Button>

          <Text fontSize="sm">
            Remembered your password?{" "}
            <Link as={RouterLink} to="/login" color="blue.500">
              Log in
            </Link>
          </Text>

          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/")}
            alignSelf="flex-start"
          >
            Back to Home
          </Button>
        </VStack>
      </Box>
    </Container>
  );
}
