import React, { useState } from 'react';
import UserBar from '../../user_bar/UserBar';
import NewEventForm from '../../new_event_form/NewEventForm';
import { EventData } from '../../../utils/Types';

interface NewEventProps {
}

const NewEvent: React.FC<NewEventProps> = () => {
    const [eventData, setEventData] = useState<EventData | null>(null);
    const handleFormSubmit = (data: EventData) => {
        setEventData(data);
    };

    return (
        <>
            <UserBar name="User"></UserBar>
            <h1> Create New Event</h1>
            <div className='form-container'>
                <NewEventForm onSubmit={handleFormSubmit}></NewEventForm>
            </div>
            
        </>
    );
};

export default NewEvent;