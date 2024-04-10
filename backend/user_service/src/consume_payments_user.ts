import * as amqp from 'amqplib';
import axios from 'axios';
import { EVENT_BY_ID, EVENT_PATH, EVENT_SERVICE, USER_EVENTS_PATH, USER_SERVICE } from './const.js';


export const consumePaymentMessages = async () => {
  try {
    // connect to RabbitMQ
    const conn = await amqp.connect(
        'amqps://ogoiffuv:GsxWycIaxByRyFDW9GZL5FgRg8p6Nanm@roedeer.rmq.cloudamqp.com/ogoiffuv'
    );
    const channel = await conn.createChannel();

    // Declare an exchange with a name 'order_exchange' and type 'fanout'.
    // 'fanout' type broadcasts all the messages it receives to all the queues it knows.
    // `{ durable: false }` means the exchange will not survive a broker restart.
    const exchange = 'payment_exchange';
    await channel.assertExchange(exchange, 'fanout', { durable: false });

    // Declare a queue with a name 'order_queue'. If it doesn't exist, it will be created.
    // `{ durable: false }` here means messages in the queue are stored in memory only, not on disk.
    const queue = 'payment_queue_users';
    await channel.assertQueue(queue, { durable: false });

    // Bind the declared queue to the exchange. This creates a relationship between the exchange and the queue.
    // Messages sent to this exchange will be routed to the queue according to the exchange type and routing rules.
    // The empty string as the third parameter is the routing key, which is ignored by fanout exchanges.
    await channel.bindQueue(queue, exchange, '');

    // Start consuming messages from the queue. The callback function is invoked whenever a message is received.
    // `msg.content.toString()` converts the message content to a string for logging or processing.
    // `channel.ack(msg)` acknowledges the message, indicating it has been processed and can be removed from the queue.
    await channel.consume(queue, async (msg) => {
        try {
          // Parse the message content to JSON
          const paymentData = JSON.parse(msg.content.toString());

          if(paymentData.status == true){
            const eventid = paymentData.eventID.toString();
            
            const event = await axios.get(`${EVENT_SERVICE}${EVENT_PATH}/${eventid}`); 
           
            const eventName = event.data.dbRes.title;
            const eventStartDate = event.data.dbRes.start_date;
            const user = paymentData.username;
            
            const data = { eventid, eventName, eventStartDate, user };
            const res= await axios.put(USER_SERVICE + USER_EVENTS_PATH, data);
            
            if(res.status == 200){
              channel.ack(msg);
              console.log(`Event ${eventName}added to user's event array successfully`);
              return;
            }
            else{
              console.log("Failed to add event to user's event array");
              channel.ack(msg);
              return;
            }
          }

          } catch (error) {
            console.error('Error processing message user:', error.message);
          }
        });
      } catch (error) {
        console.error(error);
      }
    };
