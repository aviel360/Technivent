import React, { useContext, useEffect, useState } from 'react';
import { EventData, TicketData, CommentData } from '../../../utils/Types';
import { useLocation } from 'react-router-dom';
import Api from '../../../utils/Api';
import UserBar from '../../user_bar/UserBar';
import { usernameContext } from '../home/Home';
import { Badge, Button, Card, Flex,Group,NumberInput,Text } from '@mantine/core';
import Comments from '../../comments/Comments';

interface EventPageProps {
}

function useQuery() {
    return new URLSearchParams(useLocation().search);
  }  

const EventPage: React.FC<EventPageProps> = () => {
    let query = useQuery();
    let id = query.get("id");
    const [eventData, setEventData] = useState<EventData | null>(null);
    const [commentsData, setCommentsData] = useState<CommentData[]>([]);
    const { username } = useContext(usernameContext);
    const [lowestPriceTickets, setLowestPriceTickets] = useState<TicketData | null>(null);
    const [totalTicketsAvailable, setTotalTicketsAvailable] = useState<number>(0);


    const fetchEventData = async (id: string): Promise<{ event: { dbRes: EventData }, comments: CommentData[] }> => 
    {
        const apiService = new Api();
        const response = await apiService.getEventById(id);
        return response ? response.data : { event: { dbRes: {} as EventData }, comments: [] as CommentData[] };
    };

    useEffect(() => {
        const fetchData = async () => {
            if (!id) {
                return;
            }
            const data = await fetchEventData(id);
            setEventData(data.event.dbRes);
            setCommentsData(data.comments);
        };

        fetchData();
    }, [id]);

    function getCheapestTicket(eventData: EventData): TicketData | null {
        if (eventData?.ticketArray?.length === 0) {
          return null;
        }
      
        return eventData.ticketArray.reduce((cheapestTicket, currentTicket) => {
          return currentTicket.price < cheapestTicket.price ? currentTicket : cheapestTicket;
        });
      }

    function getTotalTicketsAvailable(eventData: EventData): number {
        if (eventData?.ticketArray?.length === 0) {
          return 0;
        }
      
        return eventData.ticketArray.reduce((totalTickets, currentTicket) => {
          return totalTickets + currentTicket.available;
        }, 0);
      }

    useEffect(() => {
        if(eventData)
        {
            const lowestPriceTickets = getCheapestTicket(eventData);
            setLowestPriceTickets(lowestPriceTickets);
            const totalTicketsAvailable = getTotalTicketsAvailable(eventData);
            setTotalTicketsAvailable(totalTicketsAvailable);
        }
    }, [eventData]);

    return (
        <div>
            <UserBar username={username} goBack={false}></UserBar>
            <Flex
                mih={50}
                bg="rgba(0, 0, 0, .3)"
                gap="md"
                justify="center"
                rowGap={"1rem"}
                columnGap={"1rem"}
                align="center"
                direction="row"
                wrap="wrap"
                p={"1rem"}
                w={"55rem"}
            >

            {!eventData ? (
                    <h2>Loading Event...</h2>
                ) : 
                (
                    <div>
                        <h1>{eventData.title}</h1>
                        <Group justify="space-between" mt="xs" mb="xs">
                            <Card key={eventData.category} shadow="sm" radius="sm" withBorder w={"250px"} h={"10rem"} m={"1rem"}>
                                <Text size="xl" fw={500} mb={"md"}>{eventData.category}</Text>
                                <center>
                                    <Badge color="violet" size="lg" p={"md"}>from {lowestPriceTickets?.price}$</Badge>
                                    <Badge color="cyan" size="lg" p={"md"} mt={"md"}>{totalTicketsAvailable} tickets available</Badge>
                                </center>
                            </Card>

                            <Card key={eventData.location} shadow="sm" radius="sm" withBorder w={"300px"} h={"10rem"} >
                            {new Date(eventData.start_date).toDateString() === new Date(eventData.end_date).toDateString() ? (
                                <>
                                    <Text size="xl" fw={600}> 
                                        {new Date(eventData.start_date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric'})}
                                    </Text>
                                    <Text size="lg" fw={400}>
                                        {new Date(eventData.start_date).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                                        {" - "} {new Date(eventData.end_date).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                                    </Text>
                                </>
                            ) : (
                            <>
                                <Text size="lg" fw={500}> 
                                    {"From: "}  {new Date(eventData.start_date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric'})}
                                    {" at "} {new Date(eventData.start_date).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                                </Text>

                                <Text size="lg" fw={500} mt={"sm"}> 
                                    {"To: "}  {new Date(eventData.end_date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric'})}
                                    {" at "} {new Date(eventData.end_date).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                                </Text>
                            </>
                        )}
                                <br />
                                <center>
                                    <Badge color="grape" size="lg" p={"md"}>{"Location:  "} {eventData.location}</Badge>
                                </center>
                            </Card>
                        </Group>

                        <Card key={eventData._id} shadow="sm" radius="sm" withBorder w={"600px"}  >
                            <Text size="md" fw={400}>{eventData.description}</Text>
                            <br />
                            {eventData.image ? 
                                <img src={eventData.image} alt={eventData.title} /> : null}
                        </Card>

                        <br />
                        <h2 >Buy Tickets: </h2>
                        <Flex wrap={"wrap"} direction={"row"} >
                            {eventData.ticketArray.map((ticket) => 
                            (
                                <Card key={`${ticket._id}-${ticket.name}`} shadow="sm" radius="md" withBorder w={"15rem"} m={"10px"}>
                                <Card.Section>
                                        <center>
                                            <Badge color="pink" size="xl" p={"md"} mt={"sm"}>{ticket.name}</Badge>
                                        </center>
                                        <Text size="md" fw={400} mt={"sm"}>price: {ticket.price}$</Text>
                                        {ticket.available === 0 ? (
                                            <Text size="md" fw={400} mt={"sm"}>Sold out!</Text>
                                        ) : (
                                            <Text size="md" fw={400} mt={"sm"}>{ticket.available} tickets left!</Text>
                                        )}
                                </Card.Section>

                                <Card.Section pb={"20px"}>
                                        <form>
                                            <center>
                                            <NumberInput label={"Amount of tickets: "} placeholder='0' 
                                                w={"180px"} p={"md"} min={0}  max={ticket.available}
                                                disabled={ticket.available === 0} >
                                            </NumberInput>
                                            </center>
                                            <Button type="submit" size="md" p={"10px"} radius={"md"}
                                                    disabled={ticket.available === 0}>
                                                Purchase
                                            </Button> {/*add onClick event*/}
                                        </form>
                                    </Card.Section>
                                </Card>
                        ))}
                    </Flex>
                    
                    <br />
                        <h2>Comments: </h2>
                        <Flex justify="center">
                            <Comments Comments={commentsData} eventID={eventData._id}></Comments>
                        </Flex>
                        
                    </div>

                )}

            </Flex>
        </div>
    );

};

export default EventPage;