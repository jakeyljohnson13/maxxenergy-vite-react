// src/pages/DataPage.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  HStack,
  Button,
  Spinner,
  useColorModeValue,
} from "@chakra-ui/react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../api";              // your axios instance (adds Authorization)
import RateChart from "./RateChart";   // put RateChart.jsx in pages/, or adjust path
import { getToken, onAuthChange } from "../auth"; // your tiny auth helpers

export default function DataPage() {
  const [loading, setLoading] = useState(true);
  const [me, setMe] = useState(null);            // user profile for greeting, etc.
  const [showRates, setShowRates] = useState(true); // example toggle for RateChart
  const navigate = useNavigate();
  const location = useLocation();

  const cardBg = useColorModeValue("white", "gray.800");

  useEffect(() => {
    // 1) no token? go to login (remember where we came from)
    if (!getToken()) {
      navigate("/login", { replace: true, state: { from: location.pathname } });
      return;
    }

    // 2) if token changes (logout/login in another tab), react immediately
    const unsub = onAuthChange((isAuthed) => {
      if (!isAuthed) navigate("/login", { replace: true });
    });

    // 3) validate token by hitting a protected endpoint
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
        <HStack>
          <Spinner />
          <Text>Loading your data…</Text>
        </HStack>
      </Container>
    );
  }

  return (
    <Container maxW="6xl" py={8}>
      <VStack align="stretch" spacing={6}>
        <Box>
          <Heading size="lg">Data Dashboard</Heading>
          {me?.username && (
            <Text color="gray.500" mt={1}>
              Welcome, {me.username}.
            </Text>
          )}
        </Box>

        {/* Actions / filters / future controls */}
        <HStack>
          <Button
            size="sm"
            colorScheme={showRates ? "teal" : "gray"}
            onClick={() => setShowRates((s) => !s)}
          >
            {showRates ? "Hide" : "Show"} Time of Use Rates
          </Button>

          <Button size="sm" isDisabled title="Coming soon">
           N/A
          </Button>

          <Button size="sm" isDisabled title="Coming soon">
            N/A
          </Button>
        </HStack>

        {/* Your data widgets grid */}
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          {showRates && (
            <Box bg={cardBg} rounded="xl" shadow="md" p={4}>
              <RateChart />
            </Box>
          )}

          {/* Placeholder for future widgets */}
          <Box bg={cardBg} rounded="xl" shadow="md" p={4} minH="320px">
            <Heading size="md" mb={3}>
              Future Widget
            </Heading>
            <Text color="gray.500">
               N/A
            </Text>
          </Box>
        </SimpleGrid>
      </VStack>
    </Container>
  );
}
