import {
  Box,
  Center,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Image,
  Stack,
  Heading,
  Text,
  Button,
} from "@chakra-ui/react";

export default function About() {
  return (
    <>
      <Center py={8}>
        <Heading as="h1" size="lg" color="Black">
          About US - MAXX Energy
        </Heading>
      </Center>

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
          alt="Caffe Latte"
        />

        <Stack spacing={0} flex="1">
          <CardBody>
            <Heading size="md">Our Story</Heading>
            <Text py="2">
              Maxx Energy was founded with a vision to provide innovative, sustainable, 
              and affordable energy solutions for communities worldwide. Over the years, 
              we have grown into a trusted leader in renewable energy, offering cutting-edge solar, wind, 
              and battery storage systems that empower businesses and homes alike.
            </Text>
          </CardBody>

          <CardFooter>
            {/* <Button colorScheme="blue">Buy Latte</Button> */}
          </CardFooter>
        </Stack>
      </Card>

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
          alt="Caffe Latte"
        />

        <Stack spacing={0} flex="1">
          <CardBody>
            <Heading size="md">Our Mission</Heading>
            <Text py="2">
              Our mission is to create a cleaner and brighter future by delivering reliable and eco-friendly energy solutions. 
              We believe in reducing carbon footprints, promoting green technologies, and making sustainable energy accessible to everyone.
            </Text>
          </CardBody>

          <CardFooter>
            {/* <Button colorScheme="blue">Buy Latte</Button> */}
          </CardFooter>
        </Stack>
      </Card>


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
          alt="Caffe Latte"
        />

        <Stack spacing={0} flex="1">
          <CardBody>
            <Heading size="md">Our Team</Heading>
            <Text py="2">
              Our team is made up of passionate engineers, energy experts, and customer-focused professionals 
              dedicated to driving positive change in the energy sector. Together, we combine expertise and innovation to deliver the best solutions for our clients.
            </Text>
          </CardBody>

          <CardFooter>
            {/* <Button colorScheme="blue">Buy Latte</Button> */}
          </CardFooter>
        </Stack>
      </Card>





    </>
  );
}
