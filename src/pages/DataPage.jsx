import React, { useEffect, useState } from "react";
import {
  Box, Container, Heading, Text, VStack, HStack,
  Button, Spinner, useColorModeValue
} from "@chakra-ui/react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../api";
import RateChart from "./RateChart";
import PlantGenerationChart from "./PlantGenerationChart";
import { getToken, onAuthChange } from "../auth";

export default function DataPage() {
  const [loading, setLoading] = useState(true);
  const [me, setMe] = useState(null);
  const [showRates, setShowRates] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const cardBg = useColorModeValue("white", "gray.800");

  useEffect(() => {
    if (!getToken()) {
      navigate("/login", { replace: true, state: { from: location.pathname } });
      return;
    }
    const unsub = onAuthChange((isAuthed) => {
      if (!isAuthed) navigate("/login", { replace: true });
    });

    API.get("/users/me")
      .then((res) => setMe(res.data))
      .catch((err) => {
        if (err?.response?.status === 401) {
          navigate("/login", { replace: true, state: { from: location.pathname } });
        }
      })
      .finally(() => setLoading(false));

    return () => unsub && unsub();
  }, [navigate, location.pathname]);

  if (loading) {
    return (
      <Container maxW="6xl" py={10}>
        <HStack><Spinner /><Text>Loading your data…</Text></HStack>
      </Container>
    );
  }

  return (
    <Container maxW="6xl" py={8}>
      <VStack align="stretch" spacing={6}>
        <Box>
          <Heading size="lg">Data Dashboard</Heading>
          {me?.username && (
            <Text color="gray.500" mt={1}>Welcome, {me.username}.</Text>
          )}
        </Box>

        {/* <HStack>
          <Button
            size="sm"
            colorScheme={showRates ? "teal" : "gray"}
            onClick={() => setShowRates(s => !s)}
          >
            {showRates ? "Hide" : "Show"} Time of Use Rates
          </Button>
          <Button size="sm" isDisabled>N/A</Button>
          <Button size="sm" isDisabled>N/A</Button>
        </HStack> */}

        {/* FULL-WIDTH Plant Generation */}
        <Box bg={cardBg} rounded="xl" shadow="md" p={4} w="100%">
          <PlantGenerationChart />
        </Box>

        {/* Rates on a NEW LINE (also full width) */}
        {showRates && (
          <Box bg={cardBg} rounded="xl" shadow="md" p={4} w="100%">
            <RateChart />
          </Box>
        )}

        {/* Optional: keep any other widgets below */}
        <Box bg={cardBg} rounded="xl" shadow="md" p={4} minH="320px" w="100%">
          <Heading size="md" mb={3}>Future Widget</Heading>
          <Text color="gray.500">N/A</Text>
        </Box>
      </VStack>
    </Container>
  );
}
