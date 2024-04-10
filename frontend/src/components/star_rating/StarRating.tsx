import React, { useState } from 'react';
import { RatingType } from '../../utils/Types';
import { Flex, Rating, Text } from '@mantine/core';
import { ThemeIcon } from '@mantine/core';
import { IconStar } from '@tabler/icons-react';
import Api from '../../utils/Api';


interface StarRatingProps {
    eventRating: RatingType ; 
    eventID: string;
}


const StarRating: React.FC<StarRatingProps> = ({ eventRating, eventID }) => {
    const avg = parseFloat(eventRating.average.toFixed(1));
    const numOfRaters = eventRating.total as number;
    

    const [ratingVal, setRatingVal] = useState(0);
    
    

    const sendRating = async (newRating: number) => {
        setRatingVal(newRating);
        const apiService = new Api();    
        await apiService.EditEventRating({id:eventID, rating: newRating});
        return ;
    };

    return (
        <div>
            <Flex direction={"row"} justify={"center"} align={"center"}>
                <h2>Rating: </h2>
                
                <ThemeIcon variant={"default"} color={"yellow"} ml={"20px"} size={"sm"}>
                    <IconStar style={{ width: '70%', height: '70%'  , color:"yellow"}} />
                </ThemeIcon>
                <Text p={"10px"} fw={500} size={"lg"}> {avg.toFixed(1)}  ({numOfRaters})</Text>
                
                <Rating ml={"lg"} value={ratingVal} onChange={sendRating} size={"lg"}/>
            </Flex>
        </div>
    );
};

export default StarRating;