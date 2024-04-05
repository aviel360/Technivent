import React, { createContext, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Catalog from "../catalog/Catalog";
import Signup from "../signup/Signup";
import Login from "../login/Login";
import NewEvent from "../new_event/NewEvent";
import EventPage from "../event_page/EventPage";
import ForgotPassword from "../forgot-password/ForgotPassword";
import { UserType } from "../../../utils/Types";
import RouteAuth from "../../route_auth/RouteAuth";

interface HomeProps {}

interface userContextProps {
  username: string;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
  userType: UserType;
  setUserType: React.Dispatch<React.SetStateAction<UserType>>;
}

interface authContextProps {
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}

export const userContext = createContext<userContextProps>({
  username: "",
  setUsername: () => {},
  userType: UserType.User,
  setUserType: () => {},
});

export const authContext = createContext<authContextProps>({
  isAuthenticated: false,
  setIsAuthenticated: () => {},
});

const Home: React.FC<HomeProps> = () => {
  const [username, setUsername] = useState<string>("");
  const [userType, setUserType] = useState<UserType>(UserType.User);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  return (
    <userContext.Provider value={{ username, setUsername, userType, setUserType }}>
      <authContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
        <BrowserRouter basename="/Technivent">
          <Routes>
            <Route
              path="/"
              element={
                <RouteAuth needAuth={true}>
                  <Catalog />
                </RouteAuth>
              }
            />
            <Route
              path="/login"
              element={
                <RouteAuth needAuth={false}>
                  <Login />
                </RouteAuth>
              }
            />
            <Route
              path="/signup"
              element={
                <RouteAuth needAuth={false}>
                  <Signup />
                </RouteAuth>
              }
            />
            <Route
              path="/forgot-password"
              element={
                <RouteAuth needAuth={false}>
                  <ForgotPassword />
                </RouteAuth>
              }
            />
            <Route
              path="/newevent"
              element={
                <RouteAuth needAuth={true}>
                  <NewEvent />
                </RouteAuth>
              }
            />
            <Route
              path="/event/*"
              element={
                <RouteAuth needAuth={true}>
                  <EventPage />
                </RouteAuth>
              }
            />
            <Route path="/*" element={<Navigate to="/" />} />
          </Routes>
        </BrowserRouter>
      </authContext.Provider>
    </userContext.Provider>
  );
};

export default Home;
