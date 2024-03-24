import React from "react";
import UserBar from "../../user_bar/UserBar";
import Events from "../../events/Events";
import Api from "../../../utils/Api";
import { EventData } from "../../../utils/Types";

interface CatalogProps {}

const Catalog: React.FC<CatalogProps> = () => {

  const apiService = new Api();
  
  const fetchData = async () => {
    let data: EventData[] = [];
    try {
      const response = await apiService.getEvents();
      data = await response.json();
    } catch(error: any)
    {
      window.alert(error);
    }
    return data;
  };
  return (
    <>
      <h1>Catalog</h1>
      <UserBar></UserBar>
      <Events fetchData={fetchData}/>
    </>
  );
};

export default Catalog;
