import React, { useState } from 'react';
import { RatingType } from '../../utils/Types';
import { Flex, Rating, Text } from '@mantine/core';
import { ThemeIcon } from '@mantine/core';
import { IconStar } from '@tabler/icons-react';


interface StarRatingProps {
    eventRating: RatingType ; 
}


const StarRating: React.FC<StarRatingProps> = (eventRating) => {
    const avg = parseFloat(eventRating.eventRating.average.toFixed(1));
    const numOfRaters = eventRating.eventRating.total as number;

    const [ratingVal, setRatingVal] = useState(0);

    return (
        <div>
            <Flex direction={"row"} justify={"center"} align={"center"}>
                <h2>Rating: </h2>
                
                <ThemeIcon variant={"default"} color={"yellow"} ml={"20px"} size={"sm"}>
                    <IconStar style={{ width: '70%', height: '70%'  , color:"yellow"}} />
                </ThemeIcon>
                <Text p={"10px"} fw={500} size={"lg"}> {avg.toFixed(1)}  ({numOfRaters})</Text>
                
                <Rating ml={"lg"} value={ratingVal} onChange={setRatingVal} size={"lg"}/>
            </Flex>
        </div>
    );
};

export default StarRating;