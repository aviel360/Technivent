import { Badge, Button, Card, Center, Flex, NumberInput, Text } from "@mantine/core";
import React, { useEffect, useState } from "react";
import { TicketData } from "../../utils/Types";
import { useNavigate } from "react-router-dom";
import Api from "../../utils/Api";

interface TicketCardProps {
  ticketArray: TicketData[];
  isBackOffice: boolean;
  eventID?: string;
  eventName?: string;
}
const TicketCard: React.FC<TicketCardProps> = ({ ticketArray, isBackOffice,  eventID, eventName }) => {
  const [inputValues, setInputValues] = useState<{ [key: string]: number }>({});
  const navigate = useNavigate();

  useEffect(() => {
    const initialInputValues = ticketArray.reduce((values: { [key: string]: number }, ticket) => {
      values[ticket.name] = 0;
      return values;
    }, {});
    setInputValues(initialInputValues);
  }, [ticketArray]);

  const handleClick = async (inputValue: number, ticketName: string, ticketPrice: number, ticketId: string) => {
    const apiService = new Api();
    const response = await apiService.lockTicket({ ticketId, lockedTickets: inputValue });
    if (response)
      {
        const params = new URLSearchParams({
          ticketName: ticketName,
          ticketID: ticketId,
          Price: ticketPrice.toString(),
          amount: inputValue.toString(),
          event: eventID || '',
          name: eventName || ''
        });
        navigate(`/checkout?${params.toString()}`);
      }
  };

  const handleInputChange = (ticketName: string, value: number) => {
    setInputValues({ ...inputValues, [ticketName]: value });
  };

  return (
    <>
      <h2>{isBackOffice ? "Ticket Categories" : "Buy Tickets:"}</h2>
      <Flex wrap={"wrap"} direction={"row"} justify={Center} align={Center}>
        {ticketArray.sort((ticketA, ticketB) => ticketA.price - ticketB.price).map((ticket: TicketData) => (
          <Card key={`${ticket._id}-${ticket.name}`} shadow="sm" radius="md" withBorder w={"15rem"} m={"10px"}>
            <Card.Section>
              <center>
                <Badge color="black" size="xl" p={"md"} mt={"sm"}>
                  {ticket.name}
                </Badge>
              </center>
              <Text size="md" fw={400} mt={"sm"}>
                price: {ticket.price}$
              </Text>
            </Card.Section>

            {isBackOffice ? (
              //If backOffice than only show available tickets (not able to buy tickets)
              <Card.Section pb={"20px"}>
                <Text size="md" fw={400} mt={"md"}>
                  {" "}
                  Tickets Available:{" "}
                </Text>
                <Text size="md" fw={400}>
                  {ticket.available.toLocaleString()} / {ticket.totalTickets.toLocaleString()}
                </Text>
              </Card.Section>
            ) : (
              <Card.Section pb={"20px"}>
                {ticket.available === 0 ? (
                  <Text size="lg" fw={700} mt={"sm"}>
                    Sold out!
                  </Text>
                ) : (
                  <Text size="lg" fw={700} mt={"sm"}>
                    {ticket.available} tickets left!
                  </Text>
                )}
                <form>
                  <center>
                    <NumberInput
                      label={"Amount of tickets: "}
                      placeholder="0"
                      w={"180px"}
                      p={"md"}
                      min={0}
                      max={ticket.available}
                      disabled={ticket.available === 0}
                      value={inputValues[ticket.name] || 0}
                      onChange={(value) => handleInputChange(ticket.name, Number(value))}
                    ></NumberInput>
                  </center>
                  <Button
                    type="submit"
                    size="md"
                    p={"10px"}
                    radius={"md"}
                    disabled={ticket.available === 0 || inputValues[ticket.name] === 0}
                    onClick={(event) => {
                      event.preventDefault();
                      handleClick(inputValues[ticket.name], ticket.name, ticket.price, ticket._id || '0');
                    }}
                  >
                    Purchase
                  </Button>{" "}
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
