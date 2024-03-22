import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Catalog from "../catalog/Catalog";
import Signup from "../signup/Signup";

interface HomeProps {}

const Home: React.FC<HomeProps> = () => {
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Catalog />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
    </>
  );
};

export default Home;