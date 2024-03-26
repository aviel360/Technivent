import { Select, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { DateInput, DatePicker, DatePickerInput } from '@mantine/dates'
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EventCategory } from '../../utils/Types';
import './NewEventForm.css';

interface NewEventFormProps {
    onSubmit: (data: any) => void;
}

const NewEventForm: React.FC<NewEventFormProps> = ({onSubmit}) => {
    const navigate = useNavigate();
    const [formValues, setFormValues] = useState({});

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

    // const [startDate, setStartDate] = useState<Date | null>(null);
    // const [endDate, setEndDate] = useState<Date | null>(null);

    // const handleStartDateChange = (date: Date | null) => {
    //     setStartDate(date);
    //     eventForm.setFieldValue('start_date', date ? date.toISOString() : '');
    // };

    // const handleEndDateChange = (date: Date | null) => {
    //     setEndDate(date);
    //     eventForm.setFieldValue('end_date', date ? date.toISOString() : '');
    // };


    useEffect(() => {
        if (eventForm.validate()) {
            setFormValues(eventForm.values);
            onSubmit(eventForm.values);
        }
    }, [eventForm.values]);

    
    return (
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
            {/* <TextInput
                    size="sm"
                    label="Start Date"
                    placeholder="01/01/2024"
                    withAsterisk
                    
                    {...eventForm.getInputProps("start_date")}
                />
            <br /> */}
            {/* <TextInput
                size="sm"
                label="End Date"
                placeholder="02/01/2024"
                withAsterisk
                
                {...eventForm.getInputProps("end_date")}
            /> */}
            
            <DateInput 
                valueFormat="DD/MM/YYYY" 
                label="Start Date" 
                placeholder="01/01/2024" 
                withAsterisk 
                {...eventForm.getInputProps("start_date")}
            />
            <DateInput 
                valueFormat="DD/MM/YYYY" 
                label="End Date" 
                placeholder="02/01/2024" 
                withAsterisk 
                {...eventForm.getInputProps("end_date")}
            />

        
            </div>

         </form>
    );
};

export default NewEventForm;
