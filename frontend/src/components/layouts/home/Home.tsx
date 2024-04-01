import React, { createContext, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Catalog from "../catalog/Catalog";
import Signup from "../signup/Signup";
import Login from "../login/Login";
import NewEvent from "../new_event/NewEvent";
import EventPage from "../event_page/EventPage";
import ForgotPassword from "../forgot-password/ForgotPassword"


interface HomeProps {}

interface userContextProps {
  username: string;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
}

export const usernameContext = createContext<userContextProps>({
  username: "",
  setUsername: () => {},
});

const Home: React.FC<HomeProps> = () => {
  const [username, setUsername] = useState<string>("");

  return (
    <usernameContext.Provider value={{ username, setUsername }}>
      <BrowserRouter basename="/Technivent">
        <Routes>
          <Route path="/" element={<Catalog />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/newevent" element={<NewEvent />} />
          <Route path="/newevent" element={<NewEvent />} />  //temp route
          <Route path="/event/:id" element={<EventPage />} /> 
          
        </Routes>
      </BrowserRouter>
    </usernameContext.Provider>
  );
};

export default Home;
