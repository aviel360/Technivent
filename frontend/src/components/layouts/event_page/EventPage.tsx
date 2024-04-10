import React, { useContext, useEffect, useState } from "react";
import { EventData, TicketData, CommentData } from "../../../utils/Types";
import { useLocation } from "react-router-dom";
import Api from "../../../utils/Api";
import UserBar from "../../user_bar/UserBar";
import { userContext } from "../home/Home";
import { Badge, Button, Card, Flex, Text, Modal, Center } from "@mantine/core";
import Comments from "../../comments/Comments";
import TicketCard from "../../ticket_card/TicketCard";
import StarRating from "../../star_rating/StarRating";
import { useDisclosure } from "@mantine/hooks";
import { DateTimePicker } from "@mantine/dates";

interface EventPageProps {}

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const EventPage: React.FC<EventPageProps> = () => {
  let query = useQuery();
  let id = query.get("id");
  let isBackOffice = query.get("isBackOffice") === "true";

  const [eventData, setEventData] = useState<EventData | null>(null);
  const { username } = useContext(userContext);
  const [commentsData, setCommentsData] = useState<CommentData[]>([]);
  const [lowestPriceTickets, setLowestPriceTickets] = useState<TicketData | null>(null);
  const [totalTicketsAvailable, setTotalTicketsAvailable] = useState<number>(0);

  const [opened, { open, close }] = useDisclosure(false);
  const [newDates, setNewDates] = useState({ startDate: null, endDate: null });
  const [startDateError, setStartDateError] = useState<string | null>(null);
  const [endDateError, setEndDateError] = useState<string | null>(null);

  const handleDateChange = (type: "startDate" | "endDate", date: Date | null) => {
    if (type === "startDate" && date) {
      if (date < new Date()) {
        setStartDateError("Start date cannot be in the past");
      } else {
        setStartDateError(null);
      }
    }
    setNewDates((prevDates) => ({ ...prevDates, [type]: date }));
  };

  const handleSubmitNewDates = async () => {
    if (newDates.startDate && newDates.endDate && id !== null) {
      if (newDates.endDate > newDates.startDate) {
        const payload = { id: id, start_date: newDates.startDate, end_date: newDates.endDate };
        const apiService = new Api();
        const response = await apiService.updateEventDates(payload);
        if (response) {
          window.alert("Event dates updated successfully");
          window.location.reload();
          //TODO: make sure it is updated in user bar for anyone who bought tickets!
        }
        close();
        setEndDateError(null);
      } else {
        setEndDateError("End date must be after start date");
      }
    }
  };

  const fetchEventData = async (id: string) => {
    const apiService = new Api();
    const response = await apiService.getEventById(id);
    if (response) {
      setEventData(response.data.event);
      setCommentsData(response.data.comments);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        return;
      }
      await fetchEventData(id);
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
    if (eventData) {
      const lowestPriceTickets = getCheapestTicket(eventData);
      setLowestPriceTickets(lowestPriceTickets);
      const totalTicketsAvailable = getTotalTicketsAvailable(eventData);
      setTotalTicketsAvailable(totalTicketsAvailable);
    }
  }, [eventData]);

  return (
    <div>
      <Card bg="rgba(0, 0, 0, .3)"><h1>{eventData? eventData.title : ""}</h1></Card>
      <UserBar username={username} goBack={true}></UserBar>
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
        {!eventData ? (
          <h2>Loading Event...</h2>
        ) : (
          <div>
            <Flex justify={"space-evenly"} mt="xs" mb="xs">
              <Card bg={"none"} shadow="sm" radius="sm" w={"250px"} h={"10rem"} m={"1rem"}>
                <Text size="xl" fw={500} mb={"md"}>
                  {eventData.category}
                </Text>
                <center>
                  <Badge color="violet" size="lg" p={"md"}>
                    from {lowestPriceTickets?.price}$
                  </Badge>
                  <Badge color="cyan" size="lg" p={"md"} mt={"md"}>
                    {totalTicketsAvailable} tickets available
                  </Badge>
                </center>
              </Card>

              <Card bg={"none"} shadow="sm" radius="sm" w={"250px"} h={"10rem"} m={"1rem"}>
                {new Date(eventData.start_date).toDateString() === new Date(eventData.end_date).toDateString() ? (
                  <>
                    <Text size="xl" fw={600}>
                      {new Date(eventData.start_date).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </Text>
                    <Text size="lg" fw={400}>
                      {new Date(eventData.start_date).toLocaleTimeString("en-GB", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      {" - "}{" "}
                      {new Date(eventData.end_date).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                    </Text>
                  </>
                ) : (
                  <>
                    <Text size="lg" fw={500}>
                      {"From: "}{" "}
                      {new Date(eventData.start_date).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                      {" at "}{" "}
                      {new Date(eventData.start_date).toLocaleTimeString("en-GB", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Text>

                    <Text size="lg" fw={500} mt={"sm"}>
                      {"To: "}{" "}
                      {new Date(eventData.end_date).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                      {" at "}{" "}
                      {new Date(eventData.end_date).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                    </Text>
                  </>
                )}
                <br />
                <center>
                  <Badge color="grape" size="lg" p={"md"}>
                    {"Location:  "} {eventData.location}
                  </Badge>
                </center>
              </Card>
            </Flex>

            <Flex justify={"center"} mb={"md"}>
              {isBackOffice &&
                new Date(new Date(eventData.start_date).setHours(0, 0, 0, 0)) >
                  new Date(new Date().setHours(0, 0, 0, 0)) && (
                  <Button size={"md"} color={"indigo"} onClick={open}>
                    Edit Dates
                  </Button>
                )}
            </Flex>

            <Modal title="Edit Dates" size="sm" opened={opened} onClose={close} xOffset={0} centered>
              <div>
                <DateTimePicker
                  label="Start Date"
                  value={newDates.startDate}
                  onChange={(date) => handleDateChange("startDate", date)}
                  error={startDateError}
                />

                <DateTimePicker
                  label="End Date"
                  value={newDates.endDate}
                  onChange={(date) => handleDateChange("endDate", date)}
                  error={endDateError}
                />
                <br />
                <Button onClick={handleSubmitNewDates}>Submit</Button>
              </div>
            </Modal>
            <Center>
              <Card bg={"none"} shadow="sm" radius="sm" withBorder w={"600px"}>
                {eventData.image ? <img src={eventData.image} alt={eventData.title} /> : null}
                <br />
                <Text size="md" fw={400}>
                  {eventData.description}
                </Text>
              </Card>
            </Center>

            <br />
             
            <StarRating eventRating={eventData.rating} eventID={eventData._id}></StarRating>

            <TicketCard
              ticketArray={eventData.ticketArray}
              isBackOffice={isBackOffice}
              eventID={eventData._id}
              eventName={eventData.title}
            ></TicketCard>
            

            <br />
            <StarRating eventRating={eventData.rating} eventID={eventData._id} ></StarRating>
            <Flex justify="center">
              <Comments Comments={commentsData} eventID={eventData._id} isBackOffice={isBackOffice}></Comments>
            </Flex>
          </div>
        )}
      </Flex>
    </div>
  );
};

export default EventPage;
