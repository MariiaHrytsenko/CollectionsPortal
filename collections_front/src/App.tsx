import React from "react";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./components/AppRouter";
import Navbar from "./components/Navbar";
import { LanguageProvider } from "./LanguageContext";

const App = () => {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Navbar />
        <AppRouter />
      </BrowserRouter>
    </LanguageProvider>
  );
};

export default App;
