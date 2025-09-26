import { Injectable } from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitMQService {
  private connection: amqp.Connection;
  private channel: amqp.Channel;

  async connect() {
    this.connection = await amqp.connect('amqp://rabbitmq');
    this.channel = await this.connection.createChannel();
    await this.channel.assertQueue('image_tasks', { durable: true });
  }

  async sendToQueue(data: any) {
    if (!this.channel) await this.connect();
    this.channel.sendToQueue('image_tasks', Buffer.from(JSON.stringify(data)), {
      persistent: true,
    });
    console.log(`Sent task to queue: ${JSON.stringify(data)}`);
  }
}