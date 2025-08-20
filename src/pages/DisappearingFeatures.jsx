import React, { useRef, useEffect, useState } from "react";
import {
  Box,
  Container,
  Grid,
  GridItem,
  Heading,
  Text,
  Tag,
  chakra,
  Button,
} from "@chakra-ui/react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link as RouterLink } from "react-router-dom";
import { getToken, onAuthChange } from "../auth";

const MotionBox = motion(chakra.div);

export const DisappearingFeatures = () => {
  return (
    <>
      <Box position="relative" bg="purple.50" _dark={{ bg: "gray.800" }}>
        <Features />
      </Box>
      {/* <Box h="50vh" bg="purple.50" _dark={{ bg: "gray.900" }} /> */}
    </>
  );
};

const Features = () => {
  return (
    <Container maxW="7xl" px={{ base: 4, md: 6 }} py={{ base: 8, md: 16 }}>
      <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={{ base: 8, md: 10 }}>
        <Copy />
        <Carousel />
      </Grid>
    </Container>
  );
};

const Copy = () => {
  // ✅ Step 3: initialize from helper and subscribe to auth changes
  const [isAuthed, setIsAuthed] = useState(Boolean(getToken()));

  useEffect(() => {
    const unsubscribe = onAuthChange(setIsAuthed);
    return unsubscribe;
  }, []);

  return (
    <GridItem
      position={{ base: "static", md: "sticky" }}
      top="0"
      alignSelf="start"
      py={{ base: 8, md: 12 }}
      h={{ base: "auto", md: "100vh" }}
      display="flex"
      flexDir="column"
      justifyContent="center"
    >
      <Heading mt={2} mb={4} fontWeight="medium" lineHeight="tall" fontSize={{ base: "4xl", md: "5xl" }}>
        MAXX Energy
      </Heading>

      <Text fontSize="lg" color="gray.900" _dark={{ color: "gray.200" }} mb={6}>
        The power to build a brighter future with the data to make informed decisions, we put it all at your fingertips.
        MAXX Energy delivers the insights that power a cleaner tomorrow—transforming solar data into smarter decisions for
        a sustainable future. Step inside to discover how insight becomes impact.
      </Text>

      {!isAuthed ? (
        <Button
          as={RouterLink}
          to="/login"
          bg="#06bd28ff"
          color="white"
          _hover={{ bg: "#3aed5a" }}
          w="25%"
          minW="unset"
          px={2}
          py={2}
          textTransform="uppercase"
          fontSize="lg"
          borderRadius="15"
        >
          Get Started
        </Button>
      ) : (
        <Button
          as={RouterLink}
          to="/data-page"
          colorScheme="teal"
          w="25%"
          minW="unset"
          px={2}
          py={2}
          fontSize="lg"
          borderRadius="15"
          variant="solid"
        >
          Go to Data Page
        </Button>
      )}
    </GridItem>
  );
};

const Carousel = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const images = [
    "/AdobeStock_80511892.jpeg",
    "/AdobeStock_369434840.jpeg",
    "/AdobeStock_752637037.jpeg",
    "/AdobeStock_847300392.jpeg",
  ];

  return (
    <GridItem position="relative" w="full">
      <Box
        position="sticky"
        top="0"
        zIndex={10}
        h={{ base: 16, md: 24 }}
        display={{ base: "none", md: "block" }}
        bgGradient="linear(to-b, purple.50, transparent)"
        _dark={{ bgGradient: "linear(to-b, gray.800, transparent)" }}
      />

      <Box
        ref={ref}
        position="relative"
        zIndex={0}
        display="flex"
        flexDir="column"
        gap={{ base: 6, md: 12 }}
      >
        {images.map((src, i) => (
          <CarouselItem
            key={src}
            image={src}
            scrollYProgress={scrollYProgress}
            position={i + 1}
            numItems={images.length}
          />
        ))}
      </Box>

      <Box h={{ base: 24, md: 48 }} w="full" />
    </GridItem>
  );
};

const CarouselItem = ({ scrollYProgress, position, numItems, image }) => {
  const step = 1 / numItems;
  const end = step * position;
  const start = end - step;

  const opacity = useTransform(scrollYProgress, [start, end], [1, 0]);
  const scale = useTransform(scrollYProgress, [start, end], [1, 0.75]);

  return (
    <MotionBox
      style={{ opacity, scale }}
      display="grid"
      placeContent="center"
      w="full"
      aspectRatio={16 / 9}
      flexShrink={0}
      borderRadius="2xl"
      overflow="hidden"
      bg="gray.900"
      _dark={{ bg: "gray.700" }}
    >
      <Box
        as="img"
        src={image}
        alt={`Feature ${position}`}
        objectFit="cover"
        w="100%"
        h="100%"
      />
    </MotionBox>
  );
};
