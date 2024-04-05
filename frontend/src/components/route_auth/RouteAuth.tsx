import React, { ReactNode, useContext, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { userContext, authContext } from "../layouts/home/Home";
import Api from "../../utils/Api";
interface RouteAuthProps {
  children: ReactNode;
  needAuth: boolean;
}
const RouteAuth: React.FC<RouteAuthProps> = ({ children, needAuth }) => {
  const { setUsername, setUserType } = useContext(userContext);
  const { isAuthenticated, setIsAuthenticated } = useContext(authContext);

  const fetchUserData = async () => {
    let isAuth = false;
    const apiService = new Api();
    const response = await apiService.getUserData();
    if (response) {
      setUsername(response.data.username);
      setUserType(response.data.userType);
      isAuth = response.data.username.length > 0;
    }
    setIsAuthenticated(isAuth);
};

  useEffect(() => {
    fetchUserData();
  });

  return needAuth ? isAuthenticated ? children : <Navigate to="/login" /> : isAuthenticated ? <Navigate to="/" /> : children;
};

export default RouteAuth;
