// src/pages/Data.jsx
import { Container, Heading, VStack } from "@chakra-ui/react";
import RateChart from "./RateChart"; // now a sibling in pages

export default function DataPage() {
  return (
    <Container maxW="6xl" py={8}>
      <VStack align="stretch" spacing={6}>
        <Heading size="lg">Your Energy Data</Heading>
        <RateChart />
      </VStack>
    </Container>
  );
}
