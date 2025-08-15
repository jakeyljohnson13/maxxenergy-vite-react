import * as React from 'react';
import { ChakraProvider, Box, ColorModeScript } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import NavBar from './pages/NavBar';
import HomePage from './pages/HomePage';
import About from './pages/About';
import Header from './pages/Header';
import Faqs from './pages/Faqs';
import Footer from './pages/Footer';
import theme from "./jscript/theme";
import Contact from './pages/Contact';
import Socials from './pages/Socials';
import Register from './pages/Register';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import Profile from "./pages/Profile";
import './styles/Style.css';
import './App.css';

function Layout() {
  const location = useLocation();
  const hideLayout = ["/register", "/login", "/forgot-password"].includes(location.pathname);

  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      {!hideLayout && <Header />}
      {!hideLayout && <NavBar />}
      <Box as="main" flex="1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<About />} />
          <Route path="/faqs" element={<Faqs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/socials" element={<Socials />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Routes>
      </Box>
      {!hideLayout && <Footer />}
    </Box>
  );
}

function App() {
  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config?.initialColorMode} />
      <Router>
        <Layout />
      </Router>
    </ChakraProvider>
  );
}

export default App;
