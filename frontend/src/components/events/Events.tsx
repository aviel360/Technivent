import { useEffect, useState } from "react";
import { Card, Image, Text, Badge, Button, Group, Flex } from "@mantine/core";
import { EventData } from "../../utils/Types";

interface EventsProps {
  fetchData: () => Promise<EventData[]>;
}

function Events({ fetchData }: EventsProps) {
  const [eventsData, setEventsData] = useState<EventData[]>([]);

  const fetchEvents = async () => {
    const data = await fetchData();
    console.log(data);
    setEventsData(data);
  };

  useEffect(() => {
    fetchEvents();
  }, [fetchData]);

  return (
      <Flex mih={50} bg="rgba(0, 0, 0, .3)" gap="md" justify="center" columnGap={'1rem'} align="center" direction="row" wrap="wrap">
        {eventsData.map((event) => (
          <Card key={event._id} shadow="sm" padding="lg" radius="sm" withBorder w={'30%'}>
            <Card.Section>
              <Image src={event.image} height={160} alt={event.organizer} />
            </Card.Section>

            <Group justify="space-between" mt="md" mb="xs">
              <Text fw={500}>{event.category}</Text>
              <Badge color="pink">{new Date(event.start_date).toDateString()}</Badge>
            </Group>

            <Text size="sm" c="dimmed">
              {event.description}
            </Text>

            <Button color="blue" fullWidth mt="md" radius="md">
              Purchase tickets now
            </Button>
          </Card>
        ))}
      </Flex>
  );
}

export default Events;
