import { useEffect, useState } from "react";
import { Card, Image, Text, Badge, Group, Flex, Loader } from "@mantine/core";
import { OrderHistoryData } from "../../utils/Types";

interface OrderHistoryProps {
  fetchData: () => Promise<OrderHistoryData[]>;
}

function OrderHistory({ fetchData }: OrderHistoryProps) {
  const [ordersData, setOrdersData] = useState<OrderHistoryData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchEvents = async () => {
    debugger
    const data = await fetchData();
    setIsLoading(false);
    setOrdersData(data);
  };

  useEffect(() => {
    fetchEvents();
  }, [fetchData]);

  return isLoading ? (
    <Loader></Loader>
  ) : (
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
      {ordersData.length == 0 ? (
        <h2>No orders available</h2>
      ) : (
        ordersData.map((order) => (
          <Card key={order.event._id} shadow="sm" padding="lg" radius="sm" withBorder w={"350px"}>
            <Card.Section>
              <Image src={order.event.image} height={160} alt={order.event.organizer} />
            </Card.Section>

            <Group justify="space-between" mt="xs" mb="xs">
              <Text size="lg" fw={500}>
                {order.event.title}
              </Text>
              <Badge color="pink">{order.event.category + " event"}</Badge>
            </Group>
            <Badge mb="xs" color="teal">
              {new Date(order.event.start_date).toDateString()}
            </Badge>

            <Text size="sm" c="dimmed">
              {order.event.description}
            </Text>

            <center>
              {order.paymentArray.map((payment) => (
                <Card key={payment._id} shadow="sm" padding="lg" radius="sm" withBorder w={"50px"}>
                  <Group justify="space-between" mt="xs" mb="xs">
                  </Group>
                  <Badge mb="xs" color="teal">
                    {new Date(payment.date).toDateString()}
                  </Badge>
                    <Text size="lg" fw={500}>
                      {payment.ticketName}
                    </Text>
                    <Badge color="pink">{payment.quantity}</Badge>
                </Card>
              ))}
            </center>
          </Card>
        ))
      )}
    </Flex>
  );
}

export default OrderHistory;
