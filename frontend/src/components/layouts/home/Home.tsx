import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Catalog from "../catalog/Catalog";

interface HomeProps {}

const Home: React.FC<HomeProps> = () => {
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Catalog />} />
      </Routes>
    </BrowserRouter>
    </>
  );
};

export default Home;