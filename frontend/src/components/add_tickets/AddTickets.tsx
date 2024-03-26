import React, { useState } from 'react';
import { TicketData } from '../../utils/Types';
import './AddTickets.css';
import { Button, Flex, NumberInput, TextInput, Stack, Space, Text, Center} from '@mantine/core';
// import { Stack } from 'react-bootstrap-icons';

interface AddTicketsProps {
}

const AddTickets: React.FC<AddTicketsProps> = () => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [ticketAmount, setTicketamount] = useState(0);
    const [tickets, setTickets] = useState<TicketData[]>([]);
    const [totalTickets, setTotalTickets] = useState(0);

    const addTicket = () => {
        if (name.trim() === '' || price <= 0 || ticketAmount <= 0) {
            alert('Please enter valid values.');
            return;
          }
        setTickets([...tickets, { name, price, totalTicket: ticketAmount, available: ticketAmount }]);
        setName('');
        setPrice(0);
        setTicketamount(0);
        setTotalTickets(totalTickets + ticketAmount); 
    };
    return (
        <Flex direction='column' >
            <div className='add-tickets-container'>
                <Center inline className='input-container'>
                    
                    
                    <TextInput
                        size="sm"
                        // styles={{ input: { backgroundColor: '#e48500' } }}
                        label="Tickets Category:"
                        placeholder="Category Name"
                        value={name}
                        onChange={(event) => setName(event.currentTarget.value)}
                    
                    />
                    <NumberInput
                        size="sm"
                        className='input-field'
                        label="Price:"
                        placeholder="0"
                        min={0}
                        value={price}
                        onChange={(value) => setPrice(typeof value === 'number' ? value : 0)}
                    
                    />
                    <NumberInput
                        size="sm"
                        className='input-field'
                        label="Total Tickets:"
                        placeholder="0"
                        min={0}
                        value={ticketAmount} 
                        onChange={(value) => setTicketamount(typeof value === 'number' ? value : 0)}
                    
                    />
                    <br />
                    <Button onClick={addTicket}>Add Ticket</Button>
                </Center>

                <Flex gap="md" direction='row' wrap='wrap'>
                {tickets.map((ticket, index) => (
                        <div key={index} className='ticket-category-box'>
                            <h2>{ticket.name}</h2>
                            <Stack align="center" justify='center' gap="0px">
                                <div style={{ display: 'flex' }}>
                                    <Text><strong>Price:</strong></Text>
                                    <Space w="md" />
                                    <Text>{ticket.price}</Text>
                                </div>
                                <br />
                                <div style={{ display: 'flex' }}>
                                    <Text><strong>Total Tickets:</strong></Text>
                                    <Space w="md" />
                                    <Text>{ticket.totalTicket}</Text>
                                </div>
                                
                            </Stack>   
                    </div>
                    ))}
                </Flex>
            </div>
            <div>
                <h2> Total Tickets: {totalTickets}</h2>    
            </div>
        </Flex> 
    );
};

export default AddTickets;