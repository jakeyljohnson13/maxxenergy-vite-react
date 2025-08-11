import * as React from 'react'
import { ChakraProvider, Box, ColorModeScript } from '@chakra-ui/react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './pages/NavBar';
import HomePage from './pages/HomePage';
import About from './pages/About';
import Header from './pages/Header';
import Faqs from './pages/Faqs';
import Footer from './pages/Footer';
import './styles/Style.css';
import './App.css';
import theme from "./jscript/theme";


function App() {
 

  return (
    <ChakraProvider theme={theme}>
     <ColorModeScript initialColorMode={theme.config?.initialColorMode} />
    <Router>
     <Box minH="100vh" display="flex" flexDirection="column">
    <Header />
    <NavBar />
    <Box as="main" flex="1">
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<About />} />
      <Route path="/faqs" element={<Faqs />} />

    </Routes>
    </Box>
    <Footer />
      </Box>
    </Router>
    </ChakraProvider>
  )
}

export default App
