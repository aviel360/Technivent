import React, { useContext, useState } from "react";
import UserBar from "../../user_bar/UserBar";
import Events from "../../events/Events";
import Api from "../../../utils/Api";
import { EventData } from "../../../utils/Types";
import { userContext } from "../home/Home";

interface CatalogProps {

}

const Catalog: React.FC<CatalogProps> = () => {
  const { username } = useContext(userContext);
  const [isBackOffice, setIsBackOffice] = React.useState<boolean>(false);
  const [refreshKey] = useState(0);

  const fetchData = async () => {
    const apiService = new Api();
    let data: EventData[] = [];
    const response = isBackOffice ? await apiService.getAllEvents('all') : await apiService.getEvents();
    if (response) data = response.data.dbRes;
    return data;
  };

  return (
    <>
      <h1>{isBackOffice ? "Back Office" : "Catalog"}</h1>
      <UserBar username={username} goBack={false} isBackOffice={isBackOffice} setIsBackOffice={setIsBackOffice} refreshKey={refreshKey}></UserBar>
      <Events fetchData={fetchData} isBackOffice={isBackOffice}/>
    </>
  );
};

export default Catalog;
