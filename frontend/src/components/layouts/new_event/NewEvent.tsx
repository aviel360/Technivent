import React, { useContext } from 'react';
import UserBar from '../../user_bar/UserBar';
import { EventCategory } from '../../../utils/Types';
import { usernameContext } from '../home/Home';
import { useForm } from '@mantine/form';
import { Button, Center, Select, TextInput } from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import AddTickets from '../../add_tickets/AddTickets';
import './NewEvent.css';

interface NewEventProps {
}

const NewEvent: React.FC<NewEventProps> = () => {
    const { username } = useContext(usernameContext);


    const eventForm:any = useForm({
        initialValues: {
            title: '',
            category: '',
            description: '',
            organizer: '',
            location: '',
            start_date: '',
            end_date: '',
            image: '',
        },
        validate: {
            title: (value) => (!value && eventForm?.touched?.title ? "Please enter event title" : null),
            description: (value) => (!value &&  eventForm?.touched?.description ? "Please enter event description" : null),
            organizer: (value) => (!value &&  eventForm?.touched?.organizer ? "Please enter event organizer" : null),
            location: (value) => (!value &&  eventForm?.touched?.location ? "Please enter event location" : null),
            start_date: (value) => {
                if (!value && eventForm?.touched?.start_date) {
                    return "Please enter event start date";
                }
                if (new Date(value) <= new Date()) {
                    return "Start date must be a future date";
                }
                return null;
            },
            end_date: (value, values) => {
                if (!value && eventForm?.touched?.end_date) {
                    return "Please enter event end date";
                }
                if (values.start_date && new Date(value) < new Date(values.start_date)) {
                    return "End date must be later than start date";
                }
                return null;
            },
        },
    });
  

    return (
        <>
            <UserBar username={username} goBack={false}></UserBar>
            <h1> Create New Event</h1>
            <div className='new-event-container'>
                <form className='form-container'>
                    <div className='text-input-container'>
                        <TextInput
                            size="sm"
                            label="Title"
                            placeholder="Event title"
                            withAsterisk
                            {...eventForm.getInputProps("title")}
                        />
                        <br />
                        <Select
                            label="Category" 
                            placeholder="Select category"
                            withAsterisk
                            data={Object.values(EventCategory).map((category) => ({ value: category, label: category }))}
                            {...eventForm.getInputProps("category")}
                        />
                        <br />

                        <TextInput
                            size="sm"
                            label="Description"
                            placeholder="Description"
                            withAsterisk
                            {...eventForm.getInputProps("description")}
                        />
                        <br />

                        <TextInput
                            size="sm"
                            label="Organizer"
                            placeholder="Organizer"
                            withAsterisk
                            {...eventForm.getInputProps("oeorganizer")}
                        />
                        <br />
                    </div>
            
                    <div className='dates-container'>
                        <TextInput
                                size="sm"
                                label="Location"
                                placeholder="Location"
                                withAsterisk
                                {...eventForm.getInputProps("location")}
                            />
                        <br />

                        <TextInput
                            size="sm"
                            label="Image URL"
                            placeholder="Image URL (optional)"
                            
                            {...eventForm.getInputProps("image")}
                        />
                        <br />
                    
                        <DateTimePicker label="Pick date and time" withAsterisk placeholder="Pick date and time" {...eventForm.getInputProps("start_date")}/>
                        <br />
                        <DateTimePicker label="Pick date and time" withAsterisk placeholder="Pick date and time" {...eventForm.getInputProps("end_date")}/>

                    </div>

                </form>
                <br />
                <Center className='add-tickets-container'>
                    <AddTickets></AddTickets>
                </Center>
                <br />
                <Button color='green' size='lg'> Add New Event </Button>

            </div>
            
        </>
    );
};

export default NewEvent;