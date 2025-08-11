import React from "react";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box, Container             
} from "@chakra-ui/react";

const Faqs = () => {
  return (
    <>
    <div className="faqs-item">FAQs</div>
    <Container maxW="800px" py={8}>
    <Accordion defaultIndex={[0]} allowMultiple>
      <AccordionItem>
        <h2>
          <AccordionButton>
            <Box as="span" flex="1" textAlign="left">
              1. What services does Maxx Energy provide?
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </h2>
        <AccordionPanel as="answer" pb={4}>
        We specialize in renewable energy solutions, including solar panel installation, 
          wind energy projects, and energy storage systems for both residential and commercial clients.
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem>
        <h2>
          <AccordionButton>
            <Box as="span" flex="1" textAlign="left">
              2. How can I get a quote for solar installation?
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </h2>
        <AccordionPanel as="answer" pb={4}>
          You can request a free quote by filling out our online
         form or contacting our customer service team at contact@maxxenergy.com.
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem>
        <h2>
          <AccordionButton>
            <Box as="span" flex="1" textAlign="left">
              3. Do you offer financing options for renewable energy systems?
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </h2>
        <AccordionPanel as="answer" pb={4}>
          Yes, we provide flexible financing options and payment plans to make 
       switching to renewable energy affordable.
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem>
        <h2>
          <AccordionButton>
            <Box as="span" flex="1" textAlign="left">
              4. How long does it take to install a solar panel system?
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </h2>
        <AccordionPanel as="answer" pb={4}>
          Installation timelines vary based on the size of the project, but most residential 
        installations are completed within 1–3 days after approval and permitting.
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem>
        <h2>
          <AccordionButton>
            <Box as="span" flex="1" textAlign="left">
              5. Where is Maxx Energy located?
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </h2>
        <AccordionPanel as="answer" pb={4} >
          Our headquarters are in San Jose, CA, but we provide services 
        across multiple states. Check our website for coverage areas.
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
    </Container>
    </>
  );
};

export default Faqs;
