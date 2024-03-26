import React, { createContext, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Catalog from "../catalog/Catalog";
import Signup from "../signup/Signup";
import Login from "../login/Login";
import NewEvent from "../new_event/NewEvent";

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
          <Route path="/" element={<Catalog />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/newevent" element={<NewEvent />} />  //temp route
          
        </Routes>
      </BrowserRouter>
    </usernameContext.Provider>
  );
};

export default Home;
