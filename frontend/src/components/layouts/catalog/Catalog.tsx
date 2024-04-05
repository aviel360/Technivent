import React, { useContext } from "react";
import UserBar from "../../user_bar/UserBar";
import Events from "../../events/Events";
import Api from "../../../utils/Api";
import { EventData } from "../../../utils/Types";
import { userContext } from "../home/Home";

interface CatalogProps {

}

const Catalog: React.FC<CatalogProps> = () => {
  const { username } = useContext(userContext);
  const [isBackOffice] = React.useState<boolean>(false);

  const fetchData = async () => {
    const apiService = new Api();
    let data: EventData[] = [];
    const response = await apiService.getEvents();
    if (response) data = response.data.dbRes;
    return data;
  };

  return (
    <>
      <h1>Catalog</h1>
      <UserBar username={username} goBack={false}></UserBar>
      <Events fetchData={fetchData} isBackOffice={isBackOffice}/>
    </>
  );
};

export default Catalog;
