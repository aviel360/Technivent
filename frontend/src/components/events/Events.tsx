import { useEffect, useState } from "react";
import { Card, Image, Text, Badge, Button, Group, Flex, Container } from "@mantine/core";
import { EventData } from "../../utils/Types";

interface EventsProps {
  fetchData: () => Promise<EventData[]>;
}

function Events({ fetchData }: EventsProps) {
  const [eventsData, setEventsData] = useState<EventData[]>([]);

  const fetchEvents = async () => {
    try {
      const data = await fetchData();
      setEventsData(data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [fetchData]);

  return (
    <Container>
      <Flex mih={50} bg="rgba(0, 0, 0, .3)" gap="md" justify="center" align="center" direction="row" wrap="wrap">
        {eventsData.map((event) => (
          <Card key={event.id} shadow="sm" padding="lg" radius="md" withBorder>
            <Card.Section>
              <Image src={event.image} height={160} alt={event.organizer} />
            </Card.Section>

            <Group justify="space-between" mt="md" mb="xs">
              <Text fw={500}>{event.category}</Text>
              <Badge color="pink">{event.start_date.getDay()}</Badge>
            </Group>

            <Text size="sm" c="dimmed">
              {event.description}
            </Text>

            <Button color="blue" fullWidth mt="md" radius="md">
              Purchase now
            </Button>
          </Card>
        ))}
      </Flex>
      <Flex></Flex>
    </Container>
  );
}

export default Events;
