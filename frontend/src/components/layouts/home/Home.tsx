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
      <BrowserRouter>
        <Routes>
          <Route path="/Technivent/" element={<Catalog />} />
          <Route path="/Technivent/signup" element={<Signup />} />
          <Route path="/Technivent/login" element={<Login />} />
          <Route path="/Technivent/forgot-password" element={<ForgotPassword />} />
          <Route path="/Technivent/newevent" element={<NewEvent />} />
          <Route path="/Technivent/newevent" element={<NewEvent />} />  //temp route
          <Route path="/Technivent/event/:id" element={<EventPage />} /> 
          
        </Routes>
      </BrowserRouter>
    </usernameContext.Provider>
  );
};

export default Home;
