import { Badge, Button, Card, Center, Flex, NumberInput, Text } from '@mantine/core';
import React, { useState } from 'react';
import { TicketData } from '../../utils/Types';
import { useNavigate } from 'react-router-dom';

interface TicketCardProps {
    ticketArray: TicketData[];
    isBackOffice: boolean;
    eventName?: string;
}

const TicketCard: React.FC<TicketCardProps> = ({ ticketArray, isBackOffice, eventName}) => {
    const [inputValue, setInputValue] = useState(0);
    const navigate = useNavigate();
    
    const handleClick = (inputValue: number, ticketName: string, ticketPrice: number) => {
        navigate(`/checkout?ticketName=${ticketName}&Price=${ticketPrice}&amount=${inputValue}&event=${eventName}`);
    };

    return (
        <>
            <h2>{isBackOffice ? 'Ticket Categories' : 'Buy Tickets:'}</h2>
            <Flex wrap={"wrap"} direction={"row"} justify={Center} align={Center}>
                {ticketArray.map((ticket: TicketData) => 
                (
                    <Card key={`${ticket._id}-${ticket.name}`} shadow="sm" radius="md" withBorder w={"15rem"} m={"10px"}>
                    <Card.Section>
                            <center>
                                <Badge color="pink" size="xl" p={"md"} mt={"sm"}>{ticket.name}</Badge>
                            </center>
                            <Text size="md" fw={400} mt={"sm"}>price: {ticket.price}$</Text>
                          
                    </Card.Section>


                    {isBackOffice ? (
                        //If backOffice than only show available tickets (not able to buy tickets)
                        <Card.Section pb={"20px"}>
                        <Text size="md" fw={400} mt={"md"}> Tickets Available: </Text>
                        <Text size="md" fw={400} >{ticket.available.toLocaleString()} / {ticket.totalTickets.toLocaleString()}</Text>
                        </Card.Section>
                    ) : (
                    <Card.Section pb={"20px"}>
                            {ticket.available === 0 ? (
                                <Text size="md" fw={400} mt={"sm"}>Sold out!</Text>
                            ) : (
                                <Text size="md" fw={400} mt={"sm"}>{ticket.available} tickets left!</Text>
                            )}
                            <form>
                                <center>
                                <NumberInput label={"Amount of tickets: "} placeholder='0' 
                                    w={"180px"} p={"md"} min={0}  max={ticket.available}
                                    disabled={ticket.available === 0} 
                                    value={inputValue}
                                    onChange={(value) => setInputValue(Number(value))}>

                                </NumberInput>
                                </center>
                                <Button type="submit" size="md" p={"10px"} radius={"md"}
                                        disabled={ticket.available === 0 || inputValue === 0}
                                        onClick={() => handleClick(inputValue, ticket.name, ticket.price)}>
                                    Purchase
                                </Button> {/*add onClick event*/}
                            </form>
                        </Card.Section>
                    )}
                    </Card>
            ))}
        </Flex>
    </>
    );
};

export default TicketCard;