import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Consumer, Kafka, Producer } from 'kafkajs';

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
  private kafka: Kafka;
  private producer: Producer;
  private consumer: Consumer;

  constructor() {
    this.kafka = new Kafka({
      clientId: 'KAFKA_SERVICE',
      brokers: ['localhost:9092'],
    });
    this.producer = this.kafka.producer();
    this.consumer = this.kafka.consumer({
      groupId: 'test-group',
      sessionTimeout: 30000,
      rebalanceTimeout: 10000,
    });
  }

  async onModuleInit() {
    await this.producer.connect();
    await this.consumer.connect();
    console.log('Kafka producer and consumer connected');
    await this.consumer.subscribe({ topic: 'submission.created' });
    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        console.log({
          topic,
          partition,
          offset: message.offset,
          value: message.value?.toString(),
        });
      },
    });
  }

  async onModuleDestroy() {
    await this.producer.disconnect();
    await this.consumer.disconnect();
    console.log('Kafka producer and consumer disconnected');
  }

  async sendMessage(topic: string, message: string) {
    await this.producer.send({
      topic,
      messages: [{ value: message }],
    });
  }
}
