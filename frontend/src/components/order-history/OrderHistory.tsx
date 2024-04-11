import { useEffect, useState } from "react";
import { Card, Text, Badge, Group, Flex, Loader, Pagination, Center } from "@mantine/core";
import { OrderHistoryData } from "../../utils/Types";

interface OrderHistoryProps {
  fetchData: () => Promise<OrderHistoryData[]>;
  fetchUserRatings: () => Promise<number>;
  name: string;
}

function OrderHistory({ fetchData, fetchUserRatings, name }: OrderHistoryProps) {
  const [ordersData, setOrdersData] = useState<OrderHistoryData[]>([]);
  const [userRatings, setUserRatings] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 2;

  const fetchEvents = async () => {
    const [data, ratings] = await Promise.all([fetchData(), fetchUserRatings()]);
    setIsLoading(false);
    setOrdersData(data);
    setUserRatings(ratings);
  };

  useEffect(() => {
    fetchEvents();
  }, [fetchData, fetchUserRatings]);

  // Preprocess events data to filter and sort tickets
  const processedOrders = ordersData.sort((paymentEvent1, paymentEvent2) => {
    const date1 = new Date(paymentEvent1.event.start_date);
    const date2 = new Date(paymentEvent2.event.start_date);
    return date2.getTime() - date1.getTime();
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = processedOrders.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return isLoading ? (
    <Loader></Loader>
  ) : (
    <Flex
      mih={50}
      bg="rgba(0, 0, 0, .3)"
      gap="md"
      justify="space-between"
      rowGap={"1rem"}
      direction="row-reverse"
      wrap="wrap"
      p={"5rem"}
    >
      <Flex direction="column">
        <h2>User Details: </h2>
        <Card shadow="sm" padding="lg" radius="md" withBorder w={"350px"}>
          <Flex direction={"column"} align={"center"}>
            <Flex direction={"row"} justify={"center"} mb={"sm"}>
              <Text size={"lg"} fw={700} mr={"sm"}>
                Name:{" "}
              </Text>
              <Text size={"lg"} fw={450}>
                {" "}
                {name}
              </Text>
            </Flex>
            <Badge size={"lg"} color={"cyan"} style={{ textTransform: "capitalize", fontSize: "15px" }}>
              {" "}
              Total Ratings: {userRatings}
            </Badge>
          </Flex>
        </Card>
      </Flex>
      <Flex direction="column">
        <h2>Purchase History:</h2>
        {ordersData.length == 0 ? (
          <h2>No orders available</h2>
        ) : (
          currentItems.map((order) => (
            <>
              <Card key={order.event._id} shadow="sm" padding="lg" radius="sm" withBorder w={"350px"}>
                <Text size="xl" fw={700}>
                  {order.event.title}
                </Text>
                <Group justify="space-between" mt="xs" mb="xs">
                  <Badge color="pink">{order.event.category + " event"}</Badge>
                  <Text mb="xs" c="teal" fw={500}>
                    {new Date(order.event.start_date).toDateString()}
                  </Text>
                  <Text size="sm" c="dimmed" truncate>
                    {order.event.description}
                  </Text>
                </Group>

                <Flex mih={50} bg="rgba(0, 0, 0, .3)" gap="md" align="center" direction="row" wrap="wrap" p={"0.5rem"}>
                  {order.transactions.map((payment) => (
                    <Card key={payment._id} shadow="sm" padding="lg" radius="sm" withBorder w={"350"}>
                      <Text size="md" fw={500}>
                        {payment.quantity} Ticket{payment.quantity > 1 ? "s" : null} for {payment.price}$
                      </Text>
                      <Text>Purchased at {new Date(payment.date).toDateString()}</Text>
                    </Card>
                  ))}
                </Flex>
              </Card>
              <br />
            </>
          ))
        )}
        <Center>
          <Pagination total={Math.ceil(processedOrders.length) / itemsPerPage} onChange={paginate} />
        </Center>
      </Flex>
    </Flex>
  );
}

export default OrderHistory;
