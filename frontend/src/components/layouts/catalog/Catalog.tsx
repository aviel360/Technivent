import React from "react";
import { Link, useNavigate } from "react-router-dom";
import UserBar from "../../user_bar/UserBar";

interface CatalogProps {}

const Catalog: React.FC<CatalogProps> = () => {
  return (
    <>
      <h1>Catalog</h1>
      <UserBar></UserBar>
      <p>
        Already have an account? <Link to="login">Login</Link>
      </p>
    </>
  );
};

export default Catalog;
