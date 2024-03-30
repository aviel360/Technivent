import React, { useEffect, useState } from 'react';
import { EventData } from '../../../utils/Types';
import { useParams } from 'react-router-dom';
import Api from '../../../utils/Api';

interface EventPageProps {
}

interface EventPageParams extends Record<string, string> {
    id: string;
  }


const EventPage: React.FC<EventPageProps> = () => {
    const { id } = useParams<EventPageParams>();
    const [eventData, setEventData] = useState<EventData | null>(null);

    const fetchEventData = async (id: string): Promise<EventData> => 
    {
        const apiService = new Api();
        let data: EventData = {} as EventData;
        const response = await apiService.getEventById(id);
        console.log(response);
        if (response) data = response.data.dbRes;
        return data;
    };

    useEffect(() => {
        const fetchData = async () => {
            if (!id) {
                return;
            }
            const data = await fetchEventData(id);
            
            setEventData(data);
        };

        fetchData();
    }, [id]);

    if (!eventData) {
        return <div>Loading...</div>;
    }
    return (
        <div>
            <h1>{eventData.title}</h1>
            {/* Display other event details here */}
        </div>
    );
    
    // const [eventData, setEventData] = useState<EventData>({} as EventData);

    // const fetchEvent = async () => {
    //     try{
    //         const data = await fetchEventData();
    //         console.log(data);
    //         setEventData(data);
    //     }
    //     catch(error: any){
    //         window.alert(error) //??
    //     }
    // };
  
    // useEffect(() => {
    //     fetchEvent();
    // }, [fetchEventData]);
    
    // return (
    //     <>
            
    //     </>
    // );
};

export default EventPage;