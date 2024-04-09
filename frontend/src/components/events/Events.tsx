import { useEffect, useState } from "react";
import { Card, Image, Text, Badge, Button, Group, Flex, Loader, NumberInput } from "@mantine/core";
import { SortNumericDownAlt, SortNumericUpAlt } from "react-bootstrap-icons";
import { EventData, TicketData } from "../../utils/Types";
import { useNavigate } from "react-router-dom";
import { useForm } from "@mantine/form";

interface EventsProps {
  fetchData: () => Promise<EventData[]>;
  isBackOffice: boolean;
}

function Events({ fetchData, isBackOffice }: EventsProps) {
  const [eventsData, setEventsData] = useState<EventData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [sortAsc, setSortAsc] = useState<number>(-1);
  const [filter, setFilter] = useState<boolean>(false);
  const [min, setMin] = useState<number>(0);
  const [max, setMax] = useState<number>(Infinity);

  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      min: 0,
      max: Infinity,
    },
  });

  function shouldAppearTransparent(start_date: Date, ticketArray: TicketData[]) {
    const isPastEvent = new Date(start_date) < new Date();
    const hasNoAvailableTickets = !ticketArray.some(ticket => ticket.available > 0);
    return isPastEvent || hasNoAvailableTickets ? 0.5 : 1;
  }
  
  async function Filter(values: { min: number; max: number }) {
    setMin(values.min || 0);
    setMax(values.max || Infinity);
    setFilter(true);
  }

  const handlePurchaseClick = (id: string, isBackOffice: boolean) => {
    navigate(`/event?id=${id}&isBackOffice=${isBackOffice}`);
  };

  const handleSortClick = () => {
    setSortAsc(-sortAsc);
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
  let processedEvents = eventsData.map((event) => {
    const availableTickets = event.ticketArray
      .filter((ticket) => ticket.available > 0)
      .sort((a, b) => a.price - b.price);
    const firstTicket = availableTickets[0];
    const totalTickets = event.ticketArray.reduce((total, ticket) => total + ticket.available, 0);
    return { ...event, firstTicket, totalTickets };
  });

  filter &&
    (processedEvents = processedEvents.filter((event) => {
      return event.totalTickets > 0 && event.firstTicket.price >= min && event.firstTicket.price <= max;
    }));


  processedEvents = [...processedEvents].sort((eventA, eventB) => {
    return sortAsc*((eventA.totalTickets > 0 ? eventA.firstTicket.price : 0) - (eventB.totalTickets > 0 ? eventB.firstTicket.price : 0))
  });

  return isLoading ? (
    <Loader></Loader>
  ) : (
    <Flex justify="center" bg="rgba(0, 0, 0, .1)" direction={"column"}>
      {eventsData.length > 0 && (
        <Flex align="center" columnGap={"1rem"} flex={"1"} justify={"space-between"}>
          <Button ml={"4rem"} mt={"1rem"} size="md" variant="outline" onClick={() => handleSortClick()}>
            {sortAsc == 1 ? <SortNumericUpAlt /> : <SortNumericDownAlt />}
          </Button>
          <form onSubmit={form.onSubmit((values) => Filter(values))}>
            <Flex mr={"4rem"} align="center" columnGap={"1rem"} justify="center">
              <NumberInput size="sm" label="Min price" {...form.getInputProps("min")} w={"5rem"} />
              <NumberInput size="sm" label="Max price" {...form.getInputProps("max")} w={"5rem"} />
              <Button variant="outline" mt={"1.5rem"} type="submit">
                Filter
              </Button>
            </Flex>
          </form>
        </Flex>
      )}
      <Flex
        mih={50}
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
            <Card
              key={event._id}
              shadow="sm"
              padding="lg"
              radius="sm"
              withBorder
              w={"350px"}
              h={"350px"}
              style={{opacity: shouldAppearTransparent(event.start_date, event.ticketArray)}}
            >
              <Card.Section>
                <Image src={event.image} height={160} alt={event.organizer} />
              </Card.Section>

              <Group justify="space-between" mt="xs" mb="xs">
                <Text size="lg" fw={500}>
                  {event.title}
                </Text>
                <Badge color="pink">{event.category + " event"}</Badge>
              </Group>
              <Badge mb="xs" color="teal">
                {new Date(event.start_date).toDateString()}
              </Badge>

              <Text h={25} size="sm" c="dimmed" truncate>
                {event.description}
              </Text>

              <center>
                {event.totalTickets > 0 ? (
                  <Badge color="rgba(22, 77, 15, 1)">
                    {`${event.totalTickets} ticket${event.totalTickets !== 1 ? "s" : ""} available from ${
                      event.firstTicket.price
                    }$`}
                  </Badge>
                ) : (
                  <>
                    <br />
                    <Badge color="rgba(140, 0, 0, 1)">SOLD OUT</Badge>
                  </>
                )}

                {event.totalTickets > 0 && (
                  <Button
                    color="blue"
                    fullWidth
                    mt="sm"
                    radius="md"
                    onClick={() => handlePurchaseClick(event._id, isBackOffice)}
                  >
                    Purchase now
                  </Button>
                )}
              </center>
            </Card>
          ))
        )}
      </Flex>
    </Flex>
  );
}

export default Events;
