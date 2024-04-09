import * as amqp from 'amqplib';
import axios from 'axios';
import {TICKET_SOLD, TICKET_UNLOCK} from "./const.js";


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
    const queue = 'payment_queue';
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
            if (paymentData.status === true) {
              const user = paymentData.username;
              const soldResponse = await axios.post(TICKET_SOLD, {
                user
              });
            }
            else{
              //Unlocking tickets
              const user = paymentData.username;
              const unlockResponse = await axios.post(TICKET_UNLOCK, {
                user
              });
            }

          } catch (error) {
           
          }
        });
      } catch (error) {
        console.error(error);
      }
    };
