import React from 'react';
import UserBar from '../../user_bar/UserBar';
import NewEventForm from '../../new_event_form/NewEventForm';

interface NewEventProps {
}

const NewEvent: React.FC<NewEventProps> = () => {

    return (
        <>
            <UserBar name="User"></UserBar>
            <div className='form-container'>
                <NewEventForm></NewEventForm>
            </div>
            
        </>
    );
};

export default NewEvent;