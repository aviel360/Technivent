import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Catalog from "../catalog/Catalog";
import Signup from "../signup/Signup";
import Login from "../login/Login";
import NewEvent from "../new_event/New_event";

interface HomeProps {}

const Home: React.FC<HomeProps> = () => {
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Catalog />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/newevent" element={<NewEvent/>} />
      </Routes>
    </BrowserRouter>
    </>
  );
};

export default Home;