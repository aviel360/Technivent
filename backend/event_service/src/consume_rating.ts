import * as amqp from 'amqplib';
import { updateRating } from './routes.js';

export const consumeRatingMessages = async () => {
  try {
    // connect to RabbitMQ
    const conn = await amqp.connect(
        'amqps://ogoiffuv:GsxWycIaxByRyFDW9GZL5FgRg8p6Nanm@roedeer.rmq.cloudamqp.com/ogoiffuv'
    );
    const channel = await conn.createChannel();

    // Declare an exchange with a name 'order_exchange' and type 'fanout'.
    // 'fanout' type broadcasts all the messages it receives to all the queues it knows.
    // `{ durable: false }` means the exchange will not survive a broker restart.
    const exchange = 'rating_exchange';
    await channel.assertExchange(exchange, 'fanout', { durable: false });

    // Declare a queue with a name 'order_queue'. If it doesn't exist, it will be created.
    // `{ durable: false }` here means messages in the queue are stored in memory only, not on disk.
    const queue = 'rating_queue';
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
          console.log("Consuming message");
            // Parse the message content to JSON
            const ratingData = JSON.parse(msg.content.toString()); 
            
           // Check if the required fields are present
            if (!ratingData.eventId) {
              channel.ack(msg);
              
              return;
            }
            
            await updateRating(ratingData);
            channel.ack(msg);
          } catch (error) {
            console.error('Error processing message:', error.message);
            // Reject the message and requeue it
            channel.reject(msg, true);
          }
        });
      } catch (error) {
        console.error(error);
      }
    };
