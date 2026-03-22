import amqp from 'amqplib';

const QUEUE_NAME = 'idem-events';
const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672';

let connection: amqp.ChannelModel | null = null;
let channel: amqp.Channel | null = null;

export async function getChannel(): Promise<amqp.Channel> {
  if (channel) {
    return channel;
  }

  connection = await amqp.connect(RABBITMQ_URL);
  channel = await connection.createChannel();
  await channel.assertQueue(QUEUE_NAME, { durable: true });

  return channel;
}

export interface IdemCreatedEvent {
  type: 'idem.created';
  timestamp: string;
  data: {
    id: string;
    author: string;
    content: string;
    createdAt: string;
    isSeeded: boolean;
  };
}

export async function publishIdemCreated(event: IdemCreatedEvent): Promise<void> {
  const ch = await getChannel();
  const message = Buffer.from(JSON.stringify(event));

  ch.sendToQueue(QUEUE_NAME, message, {
    persistent: true,
    contentType: 'application/json',
  });
}

export async function closeConnection(): Promise<void> {
  if (channel) {
    await channel.close();
    channel = null;
  }
  if (connection) {
    await connection.close();
    connection = null;
  }
}
