// src/pages/DataPage.jsx
import React, { useEffect, useState } from "react";
import {
  Box, Container, Heading, Text, VStack, HStack, Spinner, Button,
  useColorModeValue,
  Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon
} from "@chakra-ui/react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../api";
import RateChart from "./RateChart";
import PlantGenerationChart from "./PlantGenerationChart";
import { getToken, onAuthChange } from "../auth";

export default function DataPage() {
  const [loading, setLoading] = useState(true);
  const [me, setMe] = useState(null);

  // MULTI-OPEN: keep an array of open panel indices
  const [openPanels, setOpenPanels] = useState([0]); // 0: Plant, 1: Rates, 2: Future

  const navigate = useNavigate();
  const location = useLocation();
  const cardBg = useColorModeValue("white", "gray.800");

  useEffect(() => {
    if (!getToken()) {
      navigate("/api/auth/login", { replace: true, state: { from: location.pathname } });
      return;
    }
    const unsub = onAuthChange((isAuthed) => {
      if (!isAuthed) navigate("/api/auth/login", { replace: true });
    });

    API.get("api/users/me")
      .then((res) => setMe(res.data))
      .catch((err) => {
        if (err?.response?.status === 401) {
          navigate("api/auth/login", { replace: true, state: { from: location.pathname } });
        }
      })
      .finally(() => setLoading(false));

    return () => unsub && unsub();
  }, [navigate, location.pathname]);

  const isOpen = (i) => openPanels.includes(i);

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
            <Text color="gray.500" mt={1}>
              Welcome, {me.username}.
            </Text>
          )}
        </Box>

        {/* Open/Close all controls */}
        <HStack spacing={3}>
          <Button size="sm" onClick={() => setOpenPanels([0, 1, 2])}>
            Open all
          </Button>
          <Button size="sm" variant="outline" onClick={() => setOpenPanels([])}>
            Close all
          </Button>
        </HStack>

        <Accordion
          allowMultiple
          index={openPanels}
          onChange={(idx) => {
            // Chakra gives an array in allowMultiple mode
            setOpenPanels(Array.isArray(idx) ? idx : [idx]);
          }}
        >
          {/* Plant Generation */}
          <AccordionItem border="none">
            <h2>
              <AccordionButton
                _expanded={{ bg: "teal.500", color: "white" }}
                borderRadius="xl"
                px={4}
                py={3}
                mb={2}
                transition="all 0.2s"
              >
                <Box as="span" flex="1" textAlign="left" fontWeight="semibold">
                  Plant Generation Dashboard
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel p={0}>
              <Box bg={cardBg} rounded="xl" shadow="md" p={4} w="100%">
                {isOpen(0) && <PlantGenerationChart />}
              </Box>
            </AccordionPanel>
          </AccordionItem>

          {/* Time-of-Use Rates */}
          <AccordionItem border="none">
            <h2>
              <AccordionButton
                _expanded={{ bg: "teal.500", color: "white" }}
                borderRadius="xl"
                px={4}
                py={3}
                mb={2}
                transition="all 0.2s"
              >
                <Box as="span" flex="1" textAlign="left" fontWeight="semibold">
                  Time of Use Rates (Weekday/Weekend)
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel p={0}>
              <Box bg={cardBg} rounded="xl" shadow="md" p={4} w="100%">
                {isOpen(1) && <RateChart />}
              </Box>
            </AccordionPanel>
          </AccordionItem>

          {/* Future Widget */}
          <AccordionItem border="none">
            <h2>
              <AccordionButton
                _expanded={{ bg: "teal.500", color: "white" }}
                borderRadius="xl"
                px={4}
                py={3}
                mb={2}
                transition="all 0.2s"
              >
                <Box as="span" flex="1" textAlign="left" fontWeight="semibold">
                  Future Widget
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel p={0}>
              <Box bg={cardBg} rounded="xl" shadow="md" p={4} w="100%">
                {isOpen(2) ? <Text color="gray.500">N/A</Text> : null}
              </Box>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </VStack>
    </Container>
  );
}



// // src/pages/DataPage.jsx
// import React, { useEffect, useState } from "react";
// import {
//   Box, Container, Heading, Text, VStack, HStack, Spinner,
//   useColorModeValue,
//   Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon
// } from "@chakra-ui/react";
// import { useNavigate, useLocation } from "react-router-dom";
// import API from "../api";
// import RateChart from "./RateChart";
// import PlantGenerationChart from "./PlantGenerationChart";
// import { getToken, onAuthChange } from "../auth";

// export default function DataPage() {
//   const [loading, setLoading] = useState(true);
//   const [me, setMe] = useState(null);
//   const [activeIndex, setActiveIndex] = useState(0); // 0: Plant, 1: Rates, 2: Future
//   const navigate = useNavigate();
//   const location = useLocation();
//   const cardBg = useColorModeValue("white", "gray.800");

//   useEffect(() => {
//     if (!getToken()) {
//       navigate("/login", { replace: true, state: { from: location.pathname } });
//       return;
//     }
//     const unsub = onAuthChange((isAuthed) => {
//       if (!isAuthed) navigate("/login", { replace: true });
//     });

//     API.get("/users/me")
//       .then((res) => setMe(res.data))
//       .catch((err) => {
//         if (err?.response?.status === 401) {
//           navigate("/login", { replace: true, state: { from: location.pathname } });
//         }
//       })
//       .finally(() => setLoading(false));

//     return () => unsub && unsub();
//   }, [navigate, location.pathname]);

//   if (loading) {
//     return (
//       <Container maxW="6xl" py={10}>
//         <HStack><Spinner /><Text>Loading your data…</Text></HStack>
//       </Container>
//     );
//   }

//   return (
//     <Container maxW="6xl" py={8}>
//       <VStack align="stretch" spacing={6}>
//         <Box>
//           <Heading size="lg">Data Dashboard</Heading>
//           {me?.username && (
//             <Text color="gray.500" mt={1}>
//               Welcome, {me.username}.
//             </Text>
//           )}
//         </Box>

//         <Accordion
//           allowToggle
//           index={activeIndex}
//           onChange={(i) => setActiveIndex(Array.isArray(i) ? (i[0] ?? -1) : i)}
//         >
//           {/* Plant Generation */}
//           <AccordionItem border="none">
//             <h2>
//               <AccordionButton
//                 _expanded={{ bg: "teal.500", color: "white" }}
//                 borderRadius="xl"
//                 px={4}
//                 py={3}
//                 mb={2}
//                 transition="all 0.2s"
//               >
//                 <Box as="span" flex="1" textAlign="left" fontWeight="semibold">
//                   Plant Generation Dashboard
//                 </Box>
//                 <AccordionIcon />
//               </AccordionButton>
//             </h2>
//             <AccordionPanel p={0}>
//               <Box bg={cardBg} rounded="xl" shadow="md" p={4} w="100%">
//                 {activeIndex === 0 && <PlantGenerationChart />}
//               </Box>
//             </AccordionPanel>
//           </AccordionItem>

//           {/* Time-of-Use Rates */}
//           <AccordionItem border="none">
//             <h2>
//               <AccordionButton
//                 _expanded={{ bg: "teal.500", color: "white" }}
//                 borderRadius="xl"
//                 px={4}
//                 py={3}
//                 mb={2}
//                 transition="all 0.2s"
//               >
//                 <Box as="span" flex="1" textAlign="left" fontWeight="semibold">
//                   Time of Use Rates (Weekday/Weekend)
//                 </Box>
//                 <AccordionIcon />
//               </AccordionButton>
//             </h2>
//             <AccordionPanel p={0}>
//               <Box bg={cardBg} rounded="xl" shadow="md" p={4} w="100%">
//                 {activeIndex === 1 && <RateChart />}
//               </Box>
//             </AccordionPanel>
//           </AccordionItem>

//           {/* Future Widget */}
//           <AccordionItem border="none">
//             <h2>
//               <AccordionButton
//                 _expanded={{ bg: "teal.500", color: "white" }}
//                 borderRadius="xl"
//                 px={4}
//                 py={3}
//                 mb={2}
//                 transition="all 0.2s"
//               >
//                 <Box as="span" flex="1" textAlign="left" fontWeight="semibold">
//                   Future Widget
//                 </Box>
//                 <AccordionIcon />
//               </AccordionButton>
//             </h2>
//             <AccordionPanel p={0}>
//               <Box bg={cardBg} rounded="xl" shadow="md" p={4} w="100%">
//                 {activeIndex === 2 ? (
//                   <Text color="gray.500">N/A</Text>
//                 ) : null}
//               </Box>
//             </AccordionPanel>
//           </AccordionItem>
//         </Accordion>
//       </VStack>
//     </Container>
//   );
// }


// import React, { useEffect, useState } from "react";
// import {
//   Box, Container, Heading, Text, VStack, HStack,
//   Button, Spinner, useColorModeValue
// } from "@chakra-ui/react";
// import { useNavigate, useLocation } from "react-router-dom";
// import API from "../api";
// import RateChart from "./RateChart";
// import PlantGenerationChart from "./PlantGenerationChart";
// import { getToken, onAuthChange } from "../auth";

// export default function DataPage() {
//   const [loading, setLoading] = useState(true);
//   const [me, setMe] = useState(null);
//   const [showRates, setShowRates] = useState(true);
//   const navigate = useNavigate();
//   const location = useLocation();
//   const cardBg = useColorModeValue("white", "gray.800");

//   useEffect(() => {
//     if (!getToken()) {
//       navigate("/login", { replace: true, state: { from: location.pathname } });
//       return;
//     }
//     const unsub = onAuthChange((isAuthed) => {
//       if (!isAuthed) navigate("/login", { replace: true });
//     });

//     API.get("/users/me")
//       .then((res) => setMe(res.data))
//       .catch((err) => {
//         if (err?.response?.status === 401) {
//           navigate("/login", { replace: true, state: { from: location.pathname } });
//         }
//       })
//       .finally(() => setLoading(false));

//     return () => unsub && unsub();
//   }, [navigate, location.pathname]);

//   if (loading) {
//     return (
//       <Container maxW="6xl" py={10}>
//         <HStack><Spinner /><Text>Loading your data…</Text></HStack>
//       </Container>
//     );
//   }

//   return (
//     <Container maxW="6xl" py={8}>
//       <VStack align="stretch" spacing={6}>
//         <Box>
//           <Heading size="lg">Data Dashboard</Heading>
//           {me?.username && (
//             <Text color="gray.500" mt={1}>Welcome, {me.username}.</Text>
//           )}
//         </Box>

//         {/* <HStack>
//           <Button
//             size="sm"
//             colorScheme={showRates ? "teal" : "gray"}
//             onClick={() => setShowRates(s => !s)}
//           >
//             {showRates ? "Hide" : "Show"} Time of Use Rates
//           </Button>
//           <Button size="sm" isDisabled>N/A</Button>
//           <Button size="sm" isDisabled>N/A</Button>
//         </HStack> */}

//         {/* FULL-WIDTH Plant Generation */}
//         <Box bg={cardBg} rounded="xl" shadow="md" p={4} w="100%">
//           <PlantGenerationChart />
//         </Box>

//         {/* Rates on a NEW LINE (also full width) */}
//         {showRates && (
//           <Box bg={cardBg} rounded="xl" shadow="md" p={4} w="100%">
//             <RateChart />
//           </Box>
//         )}

//         {/* Optional: keep any other widgets below */}
//         <Box bg={cardBg} rounded="xl" shadow="md" p={4} minH="320px" w="100%">
//           <Heading size="md" mb={3}>Future Widget</Heading>
//           <Text color="gray.500">N/A</Text>
//         </Box>
//       </VStack>
//     </Container>
//   );
// }
