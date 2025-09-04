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
  Text,
  Link,
} from "@chakra-ui/react";
import { Link as RouterLink, useNavigate, useSearchParams } from "react-router-dom";

export default function ResetPassword() {
  const [search] = useSearchParams();
  const token = search.get("token") || ""; // reset token from email link

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [touched, setTouched] = useState({ password: false, confirm: false });
  const [submitting, setSubmitting] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();

  const errors = {
    password: password.length >= 8 ? "" : "Password must be at least 8 characters.",
    confirm: confirm === password ? "" : "Passwords do not match.",
    token: token ? "" : "Reset token is missing.",
  };
  const isInvalid = (f) => Boolean(errors[f] && touched[f]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ password: true, confirm: true });

    if (errors.password || errors.confirm || errors.token) return;

    try {
      setSubmitting(true);
      const baseUrl = import.meta.env.VITE_API_URL || "";
      const res = await fetch(`${baseUrl}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ token, password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || `Reset failed (${res.status})`);
      }

      toast({
        title: "Password updated",
        description: "You can now log in with your new password.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      navigate("/api/auth/login");
    } catch (err) {
      toast({
        title: "Reset error",
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
      <Heading size="lg" mb={6}>Set a new password</Heading>

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
          <FormControl isInvalid={isInvalid("password")} isRequired>
            <FormLabel>New Password</FormLabel>
            <InputGroup>
              <Input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                placeholder="At least 8 characters"
                autoComplete="new-password"
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
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, confirm: true }))}
                autoComplete="new-password"
              />
              <InputRightElement width="4.5rem">
                <Button variant="ghost" size="sm" onClick={() => setShowConfirm((s) => !s)}>
                  {showConfirm ? "Hide" : "Show"}
                </Button>
              </InputRightElement>
            </InputGroup>
            <FormErrorMessage>{errors.confirm}</FormErrorMessage>
          </FormControl>

          <Button
            type="submit"
            colorScheme="teal"
            isLoading={submitting}
            loadingText="Updating..."
            alignSelf="flex-start"
          >
            Update password
          </Button>

          <Text fontSize="sm">
            Back to{" "}
            <Link as={RouterLink} to="/login" color="blue.500">
              Login
            </Link>
