import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: "purple.50" , 
        color: "black",  
        margin: 0,
        padding: 0,
      },
      "span": {
        color: "black",
        fontSize: "xl",
      },
      "answer": {
        display: "block",
        paddingLeft: "1rem",   
        textDecoration: "none",
        color: "#d38003ff",
        fontSize: "lg",
      },
    },
  },
});

export default theme;
