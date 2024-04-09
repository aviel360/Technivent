import { useEffect, useState } from "react";
import { Card, Image, Text, Badge, Button, Group, Flex, Loader } from "@mantine/core";
import { EventData, TicketData } from "../../utils/Types";
import { useNavigate } from "react-router-dom";

interface EventsProps {
  fetchData: () => Promise<EventData[]>;
  isBackOffice: boolean;
}

function Events({ fetchData, isBackOffice }: EventsProps) {
  const [eventsData, setEventsData] = useState<EventData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  const handlePurchaseClick = (id: string, isBackOffice: boolean) => {
    navigate(`/event?id=${id}&isBackOffice=${isBackOffice}`);
  };

  const fetchEvents = async () => {
    const data = await fetchData();
    setIsLoading(false);
    setEventsData(data);
  };

  useEffect(() => {
    fetchEvents();
  }, [fetchData, isBackOffice]);


  // Preprocess events data to filter and sort tickets
  const processedEvents = eventsData.map((event) => {
    const availableTickets = event.ticketArray
    .filter((ticket) => ticket.available > 0)
    .sort((a, b) => a.price - b.price);
    const firstTicket = availableTickets[0];
    const totalTickets = event.ticketArray.reduce((total, ticket) => total + ticket.available, 0);
    return { ...event, firstTicket, totalTickets };
  });

  function shouldAppearTransparent(start_date: Date, ticketArray: TicketData[]) {
    const isPastEvent = new Date(start_date) < new Date();
    const hasNoAvailableTickets = !ticketArray.some(ticket => ticket.available > 0);
    return isPastEvent || hasNoAvailableTickets ? 0.5 : 1;
  }

  return ( isLoading ? <Loader></Loader> :
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
    >
      {eventsData.length == 0 ? (
        <h2>No events available, try again later</h2>
      ) : (
        processedEvents.map((event) => (
          <Card key={event._id} shadow="sm" padding="lg" radius="sm" withBorder w={"350px"}
          style={{opacity: shouldAppearTransparent(event.start_date, event.ticketArray)}}>
            <Card.Section>
              <Image src={event.image} height={160} alt={event.organizer} />
            </Card.Section>

            <Group justify="space-between" mt="xs" mb="xs">
              <Text size="lg" fw={500}>{event.title}</Text>
              <Badge color="pink">{event.category + " event"}</Badge>
            </Group>
            <Badge mb="xs" color="teal">{new Date(event.start_date).toDateString()}</Badge>

            <Text size="sm" c="dimmed">
              {event.description}
            </Text>

            <center>
            <Badge color="rgba(22, 77, 15, 1)">
                {event.totalTickets} ticket{event.totalTickets !== 1 ? 's' : ''} available {event.totalTickets > 0 ? `from ${event.firstTicket.price}$` : ""}
              </Badge>
            </center>

            <Button color="blue" fullWidth mt="sm" radius="md" 
            onClick={() => handlePurchaseClick(event._id, isBackOffice)}>
              Purchase now
            </Button>
          </Card>
        ))
      )}
    </Flex>
  );
}

export default Events;
