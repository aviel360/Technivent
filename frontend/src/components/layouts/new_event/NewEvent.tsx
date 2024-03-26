import React, { useState } from "react";
import { TextInput, Button, Select, Text, Flex, NumberInput, Card, Center, Group } from "@mantine/core";
import { useForm } from "@mantine/form";
import { EventCategory, TicketData } from "../../../utils/Types.ts";
import { DateTimePicker } from "@mantine/dates";

interface NewEventProps {}

const NewEvent: React.FC<NewEventProps> = () => {
  const [tickets, setTickets] = useState<TicketData[]>([]);

  const eventForm = useForm({
    initialValues: {
      title: "",
      category: "",
      description: "",
      organizer: "",
      location: "",
      start_date: "",
      end_date: "",
      image: "",
    },

    validate: {
      title: (value) => (value.length < 1 ? "Please enter event title" : null),
      category: (value) => (value.length < 1 ? "Please select category" : null),
      description: (value) => (value.length < 1 ? "Please enter event description" : null),
      organizer: (value) => (value.length < 1 ? "Please enter event organizer" : null),
      location: (value) => (value.length < 1 ? "Please enter event location" : null),
      start_date: (value) =>
        value.length < 1
          ? "Please enter event start date"
          : new Date() > new Date(value)
          ? "Start date must be future date"
          : null,
      end_date: (value, values) =>
        value.length < 1
          ? "Please enter event start date"
          : new Date(values.start_date) > new Date(value)
          ? "End date must be later than start date"
          : null,
      image: () => null,
    },
  });
  const ticketForm = useForm({
    initialValues: {
      category: "",
      price: 0,
      totalTickets: 0,
    },

    validate: {
      category: (value) => (value.length < 1 ? "Please enter category" : null),
      price: (value) => (value <= 0 ? "Please enter valid price" : null),
      totalTickets: (value) => (value <= 0 ? "Please enter valid amount" : null),
    },
  });

  async function NewEvent(values: {
    title: string;
    category: string;
    description: string;
    organizer: string;
    location: string;
    start_date: string;
    end_date: string;
    image: string;
  }): Promise<void> {
    console.log(values);
  }

  function NewTicket(values: { category: string; price: number; totalTickets: number }): void {
    const newTicket: TicketData = {
      name: values.category,
      price: values.price,
      totalTickets: values.totalTickets,
      available: values.totalTickets,
    };
    const newTicketArray: TicketData[] = [...tickets, newTicket];
    setTickets(newTicketArray);
  }
  return (
    <>
      <h1>New Event</h1>
      <Flex bg="rgba(0, 0, 0, .3)" miw={"80rem"} mih={"49rem"} direction="column" p={"1rem"}>
        <form onSubmit={eventForm.onSubmit((values) => NewEvent(values))}>
          <Flex justify="space-around" align="center" direction="row" mb={"2rem"}>
            <Flex direction={"column"}>
              <TextInput
                label="Title"
                placeholder="Event title"
                size="md"
                withAsterisk
                {...eventForm.getInputProps("title")}
              />
              <Select
                label="Category"
                placeholder="Select category"
                size="md"
                mt={"0.5rem"}
                withAsterisk
                data={Object.values(EventCategory).map((category) => ({ value: category, label: category }))}
                {...eventForm.getInputProps("category")}
              />
              <TextInput
                label="Description"
                placeholder="Description"
                size="md"
                mt={"0.5rem"}
                withAsterisk
                {...eventForm.getInputProps("description")}
              />
            <TextInput
                size="md"
                mt={"0.5rem"}
                label="Image URL"
                placeholder="Image URL (optional)"
                {...eventForm.getInputProps("image")}
              />
            </Flex>

            <Flex direction={"column"}>
              <DateTimePicker
                label="Pick start date and time"
                size="md"
                withAsterisk
                placeholder="Pick start date and time"
                {...eventForm.getInputProps("start_date")}
              />
              <br/>
              <DateTimePicker
                label="Pick end date and time"
                size="md"
                withAsterisk
                placeholder="Pick end date and time"
                {...eventForm.getInputProps("end_date")}
              />
                            <TextInput
                size="md"
                label="Organizer"
                placeholder="Organizer"
                mt={"0.5rem"}
                withAsterisk
                {...eventForm.getInputProps("organizer")}
              />
              <TextInput
                size="md"
                label="Location"
                placeholder="Location"
                mt={"0.5rem"}
                withAsterisk
                {...eventForm.getInputProps("location")}
              />
            </Flex>
          </Flex>
          <Center>
            <Button color="green" size="lg" type="submit" pos={"absolute"} bottom={"-1rem"}>
              Add New Event
            </Button>
          </Center>
        </form>

        <form onSubmit={ticketForm.onSubmit((values) => NewTicket(values))}>
          <Flex>
            {tickets.map((ticket, index) => (
              <Card key={index} padding="sm" m={"1rem"} radius="sm" withBorder mah={"6rem"}>
                <Text size="md"  fw={500}>
                  Category: {ticket.name}
                </Text>
                <Text size="md" fw={500}>
                  Price: {ticket.price}
                </Text>
                <Text size="md" fw={500}>
                  Total Tickets: {ticket.totalTickets}
                </Text>
              </Card>
            ))}
            <Flex direction={"column"} maw={"20%"} p={"1rem"}>
              <TextInput
                size="md"
                label="Tickets Category:"
                placeholder="Category Name"
                withAsterisk
                {...ticketForm.getInputProps("category")}
              />
              <NumberInput
                size="md"
                className="input-field"
                label="Price:"
                placeholder="0"
                withAsterisk
                {...ticketForm.getInputProps("price")}
              />
              <NumberInput
                size="md"
                className="input-field"
                label="Total Tickets:"
                placeholder="0"
                withAsterisk
                {...ticketForm.getInputProps("totalTickets")}
              />
              <Button size="md" mt={"1.5rem"} type="submit">
                Add Ticket
              </Button>
            </Flex>
          </Flex>
        </form>
      </Flex>
    </>
  );
};

export default NewEvent;
