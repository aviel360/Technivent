import React, { useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import UserBar from '../../user_bar/UserBar';
import { userContext } from '../home/Home';
import { Button, Card, Flex, Text } from '@mantine/core';

interface OrderSuccessProps {
   
}

function useQuery() {
    return new URLSearchParams(useLocation().search);
  }  

const OrderSuccess: React.FC<OrderSuccessProps> = () => {
    const { username } = useContext(userContext);
    let query = useQuery();
    let orderId =  query.get("id");
    let event =  query.get("event");
    let ticket =  query.get("ticket");
    let price = query.get("price");
    let amount = query.get("amount");

    let navigate = useNavigate();
    const handleGoBackToCatalog = () => {
        navigate('/', { state: { refreshKey: Date.now() } });
      };
    const totalPrice = Number(price) * Number(amount);
    
    return (
        
        <div>
            <h1 >Order success</h1>
            <UserBar username={username} goBack={false} ></UserBar>
            <Flex
                mih={50}
                bg="rgba(0, 0, 0, .3)"
                gap="md"
                justify={"center"}
                rowGap={"1rem"}
                columnGap={"1rem"}
                align="center"
                direction="column"
                wrap="wrap"
                p={"4rem"}
                
            >
                <Card w={"500px"} h={"400px"}>
                    <Text mt={"xl"} size={"2.5rem"} fw={"700"} tt={"capitalize"} c={"green"}>congratulations!</Text>
                    <Text mt={"xl"} size={"2rem"} fw={"700"} tt={"capitalize"}>Enjoy your event!</Text>
                    <Text mt={"lg"} size={"1.3rem"} fw={"500"} tt={"capitalize"} c={"teal"}>Order ID: {orderId}</Text>
                    
                    <br />
                    <br />

                    <Text mt={"lg"} size={"1.5rem"} fw={"500"} tt={"capitalize"} c="rgba(145, 236, 172, 0.8)"> {event}</Text>
                    <Text mt={"lg"} size={"1.2rem"} fw={"400"} > {amount} x {ticket}</Text>
                    <Text mt={"lg"} size={"1.2rem"} fw={"400"} > Total: {totalPrice} $</Text>
                </Card>

                <Button  onClick={handleGoBackToCatalog} justify='center' w={"500px"}>
                    Go Back To Catalog
                </Button>
            </Flex>
            
        </div>
    );
};

export default OrderSuccess;
