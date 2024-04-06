import React, { useContext } from "react";
import UserBar from "../../user_bar/UserBar";
import { userContext } from "../home/Home";
import OrderHistory from "../../order-history/OrderHistory";
import { OrderHistoryData } from "../../../utils/Types";
import Api from "../../../utils/Api";

interface UserPageProps {

}

const UserPage: React.FC<UserPageProps> = () => {
  const { username } = useContext(userContext);

  const fetchData = async () => {
    const apiService = new Api();
    let data: OrderHistoryData[] = [];
    const response = await apiService.getPayments();
    if (response) data = response.data;
    return data;
  };
  return (
    <>
      <h1>Personal Space</h1>
      <UserBar goBack={true} username={username}></UserBar>
      <OrderHistory fetchData={fetchData}></OrderHistory>
    </>
  );
};

export default UserPage;
