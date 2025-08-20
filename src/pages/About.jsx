// src/pages/About.jsx
import {
  Box,
  Center,
  Card,
  CardBody,
  Image,
  Stack,
  Heading,
  Text,
  SimpleGrid,
  List,
  ListItem,
  ListIcon,
  HStack,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { CheckCircleIcon, ArrowRightIcon, ExternalLinkIcon } from "@chakra-ui/icons";

export default function About() {
  return (
    <>
      <Center py={8}>
        <Heading as="h1" size="lg" color="black">
          About US - MAXX Energy
        </Heading>
      </Center>

      {/* Our Story */}
      <Card
        direction={{ base: "column", sm: "row" }}
        overflow="hidden"
        variant="outline"
        maxW="3xl"
        mx="auto"
        my={8}
        boxShadow="md"
        borderRadius="lg"
      >
        <Image
          objectFit="cover"
          maxW={{ base: "100%", sm: "240px" }}
          src="/AdobeStock_809523421.jpeg"
          alt="Our Story"
        />
        <Stack spacing={0} flex="1">
          <CardBody>
            <Heading size="md">Our Story</Heading>
            <Text py="2">
              Maxx Energy was founded with a vision to provide innovative, sustainable,
              and affordable energy solutions for communities worldwide. Over the years,
              we have grown into a trusted leader in renewable energy, offering cutting-edge
              solar, wind, and battery storage systems that empower businesses and homes alike.
            </Text>
          </CardBody>
        </Stack>
      </Card>

      {/* Our Mission */}
      <Card
        direction={{ base: "column", sm: "row" }}
        overflow="hidden"
        variant="outline"
        maxW="3xl"
        mx="auto"
        my={8}
        boxShadow="md"
        borderRadius="lg"
      >
        <Image
          objectFit="cover"
          maxW={{ base: "100%", sm: "240px" }}
          src="/AdobeStock_730734680.jpeg"
          alt="Our Mission"
        />
        <Stack spacing={0} flex="1">
          <CardBody>
            <Heading size="md">Our Mission</Heading>
            <Text py="2">
              Our mission is to create a cleaner and brighter future by delivering reliable
              and eco-friendly energy solutions. We believe in reducing carbon footprints,
              promoting green technologies, and making sustainable energy accessible to everyone.
            </Text>
          </CardBody>
        </Stack>
      </Card>

      {/* Our Team */}
      <Card
        direction={{ base: "column", sm: "row" }}
        overflow="hidden"
        variant="outline"
        maxW="3xl"
        mx="auto"
        my={8}
        boxShadow="md"
        borderRadius="lg"
      >
        <Image
          objectFit="cover"
          maxW={{ base: "100%", sm: "240px" }}
          src="/AdobeStock_847615811.jpeg"
          alt="Our Team"
        />
        <Stack spacing={0} flex="1">
          <CardBody>
            <Heading size="md">Our Team</Heading>
            <Text py="2">
              Our team is made up of passionate engineers, energy experts, and customer-focused
              professionals dedicated to driving positive change in the energy sector. Together,
              we combine expertise and innovation to deliver the best solutions for our clients.
            </Text>
          </CardBody>
        </Stack>
      </Card>


      <Box maxW="5xl" mx="auto" px={4} mt={12} mb={16}>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>

          <Box
            p={6}
            bg="orange.50"
            _dark={{ bg: "gray.700" }}
            borderRadius="xl"
            boxShadow="sm"
            borderWidth="1px"
          >
            <Heading size="md" mb={3} textAlign={{ base: "left", md: "center" }}>
              What We Do
            </Heading>
            <List spacing={3}>
              <ListItem>
                <ListIcon as={ArrowRightIcon} color="orange.400" />
                <Text as="span" fontWeight="semibold">Solar Energy Solutions</Text> – High-efficiency solar
                panel systems for residential and commercial use.
              </ListItem>
              <ListItem>
                <ListIcon as={ArrowRightIcon} color="orange.400" />
                <Text as="span" fontWeight="semibold">Wind Energy Projects</Text> – Sustainable power through
                advanced wind turbine technologies.
              </ListItem>
              <ListItem>
                <ListIcon as={ArrowRightIcon} color="orange.400" />
                <Text as="span" fontWeight="semibold">Energy Storage Systems</Text> – Reliable battery storage
                for consistent energy supply.
              </ListItem>
            </List>
          </Box>

          <Box
            p={6}
            bg="green.50"
            _dark={{ bg: "gray.700" }}
            borderRadius="xl"
            boxShadow="sm"
            borderWidth="1px"
          >
            <Heading size="md" mb={3} textAlign={{ base: "left", md: "center" }}>
              Our Values
            </Heading>
            <List spacing={3}>
              <ListItem>
                <ListIcon as={CheckCircleIcon} color="green.500" />
                Innovation in renewable energy
              </ListItem>
              <ListItem>
                <ListIcon as={CheckCircleIcon} color="green.500" />
                Commitment to sustainability
              </ListItem>
              <ListItem>
                <ListIcon as={CheckCircleIcon} color="green.500" />
                Transparency and customer satisfaction
              </ListItem>
            </List>
          </Box>
        </SimpleGrid>


        <Box
          mt={8}
          p={6}
          bg="blue.50"
          _dark={{ bg: "gray.700" }}
          borderRadius="xl"
          boxShadow="sm"
          borderWidth="1px"
          textAlign="center"
        >
          <Heading size="md" mb={4}>
            Follow us on
          </Heading>
          <HStack spacing={6} justify="center">
            <ChakraLink href="https://www.facebook.com/maxxpotentialllc/" isExternal color="blue.600" _dark={{ color: "blue.300" }}>
              Facebook <ExternalLinkIcon mx="2px" />
            </ChakraLink>
            <ChakraLink href="https://x.com/MaxxTechnology" isExternal color="blue.600" _dark={{ color: "blue.300" }}>
              Twitter <ExternalLinkIcon mx="2px" />
            </ChakraLink>
            <ChakraLink href="https://www.linkedin.com/company/maxx-potential/" isExternal color="blue.600" _dark={{ color: "blue.300" }}>
              LinkedIn <ExternalLinkIcon mx="2px" />
            </ChakraLink>
            <ChakraLink href="https://www.instagram.com/maxxpotentialtech/?hl=en" isExternal color="blue.600" _dark={{ color: "blue.300" }}>
              Instagram <ExternalLinkIcon mx="2px" />
            </ChakraLink>
          </HStack>
        </Box>
      </Box>
    </>
  );
}
