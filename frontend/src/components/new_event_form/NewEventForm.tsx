import { Select, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { DatePicker } from '@mantine/dates'
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EventCategory } from '../../utils/Types';
import './NewEventForm.css';

interface NewEventFormProps {}

const NewEventForm: React.FC<NewEventFormProps> = () => {
    const navigate = useNavigate();
    const [dateValue, setDateValue] = useState<Date | null>(null);

    const eventForm = useForm({
        initialValues: {
            title: '',
            category: '',
            description: '',
            organizer: '',
            location: '',
            start_date: null,
            end_date: null,
            image: '',
        },
        validate: {
            title: (value) => (value.length < 1 ? "Please enter event title" : null),
            description: (value) => (value.length < 1 ? "Please enter event description" : null),
            organizer: (value) => (value.length < 1 ? "Please enter event organizer" : null),
            location: (value) => (value.length < 1 ? "Please enter event location" : null),
            start_date: (value) => (!value ? "Please enter event start date" : null),
            end_date: (value) => (!value ? "Please enter event end date" : null),
        },
    });


    return (
         <form className='form-container'>{/*onSubmit={eventForm.onSubmit((values) => RequestSignup(values))>*/}
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

            </div>
            
            <div className='dates-container'>
                <div className="datepicker-container">
                    <label htmlFor="datePicker">Start Date:</label>
                    <DatePicker
                        value={dateValue}
                        onChange={setDateValue}
                        allowDeselect
                    />
                </div>
                <br />
                <div className="datepicker-container">
                    <label htmlFor="datePicker">End Date:</label>
                    <DatePicker
                        value={dateValue}
                        onChange={setDateValue}
                        allowDeselect
                    />
                </div>
            </div>

         </form>
    );
};

export default NewEventForm;
