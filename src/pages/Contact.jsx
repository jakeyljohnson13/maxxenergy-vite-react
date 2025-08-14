// src/pages/Contact.jsx
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
  Textarea,
  VStack,
  useToast,
} from "@chakra-ui/react";

export default function Contact() {
  const toast = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [values, setValues] = useState({ name: "", email: "", message: "" });
  const [touched, setTouched] = useState({});

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const errors = {
    name: values.name.trim() === "" ? "Name is required." : "",
    email:
      values.email.trim() === ""
        ? "Email is required."
        : !emailRegex.test(values.email)
        ? "Enter a valid email."
        : "",
    message:
      values.message.trim() === "" ? "Please enter your message." : "",
  };

  const isInvalid = {
    name: !!errors.name && touched.name,
    email: !!errors.email && touched.email,
    message: !!errors.message && touched.message,
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
  };

  const onBlur = (e) => {
    const { name } = e.target;
    setTouched((t) => ({ ...t, [name]: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
   
    setTouched({ name: true, email: true, message: true });

    if (errors.name || errors.email || errors.message) return;

    try {
      setSubmitting(true);

      
      await new Promise((r) => setTimeout(r, 800));

      toast({
        title: "Message sent!",
        description: "Thank You for the message.",
        status: "success",
        duration: 4000,
        isClosable: true,
      });

      
      setValues({ name: "", email: "", message: "" });
      setTouched({});
    } catch (err) {
      toast({
        title: "Something went wrong.",
        description: "Please try again in a moment.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container maxW="lg" py={{ base: 8, md: 12 }}>
      <Heading size="lg" mb={6}>
        Contact Us
      </Heading>

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
          <FormControl isInvalid={isInvalid.name} isRequired>
            <FormLabel>Name</FormLabel>
            <Input
              name="name"
              value={values.name}
              onChange={onChange}
              onBlur={onBlur}
              placeholder="Enter Name"
            />
            <FormErrorMessage>{errors.name}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={isInvalid.email} isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              name="email"
              value={values.email}
              onChange={onChange}
              onBlur={onBlur}
              placeholder="name@example.com"
            />
            <FormErrorMessage>{errors.email}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={isInvalid.message} isRequired>
            <FormLabel>Message</FormLabel>
            <Textarea
              name="message"
              value={values.message}
              onChange={onChange}
              onBlur={onBlur}
              placeholder="Enter Message"
              rows={6}
            />
            <FormErrorMessage>{errors.message}</FormErrorMessage>
          </FormControl>

          <Button
            type="submit"
            colorScheme="teal"
            isLoading={submitting}
            loadingText="Sending..."
            alignSelf="flex-start"
          >
            Send Message
          </Button>
        </VStack>
      </Box>
    </Container>
  );
}
