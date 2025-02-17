import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Consumer, Kafka, Producer } from 'kafkajs';
import { BuildResult, DockerService } from '../docker/docker.service';
import { Submission, TaskEnv, TaskEnvStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
  private kafka: Kafka;
  private producer: Producer;
  private consumer1: Consumer;
  private consumer2: Consumer;

  constructor(
    private readonly dockerService: DockerService,
    private readonly prismaService: PrismaService,
  ) {
    this.kafka = new Kafka({
      clientId: 'KAFKA_SERVICE',
      brokers: ['localhost:9092'],
    });
    this.producer = this.kafka.producer();
    this.consumer1 = this.kafka.consumer({ groupId: 'group-1' });
    this.consumer2 = this.kafka.consumer({ groupId: 'group-2' });
  }

  async handleMessage(message: any) {
    console.log(message);
  }

  async onModuleInit() {
    await this.producer.connect();
    await this.consumer1.connect();
    console.log('Kafka producer and consumer connected');
    await this.consumer1.subscribe({ topic: 'submission.created' });
    await this.consumer1.run({
      eachMessage: async ({ topic, partition, message }) => {
        const messageValue = message.value?.toString();
        console.log({
          topic,
          partition,
          offset: message.offset,
          value: messageValue,
        });
        const submission: Submission = JSON.parse(messageValue || '{}');
        await this.handleMessage(submission);
      },
    });
    await this.consumer2.subscribe({ topic: 'taskEnv.created' });
    await this.consumer2.run({
      eachMessage: async ({ topic, partition, message }) => {
        const messageValue = message.value?.toString();
        console.log({
          topic,
          partition,
          offset: message.offset,
          value: messageValue,
        });
        const taskEnv: TaskEnv = JSON.parse(messageValue || '{}');
        await this.handleMessage(taskEnv);
        const result: BuildResult =
          await this.dockerService.buildImageFromDockerfileContent(
            taskEnv.dockerImage,
            taskEnv.name,
          );
        if (result.success) {
          this.prismaService.taskEnv.update({
            where: { id: taskEnv.id },
            data: { status: TaskEnvStatus.active },
          });
        }
      },
    });
  }

  async onModuleDestroy() {
    await this.producer.disconnect();
    await this.consumer1.disconnect();
    await this.consumer2.disconnect();
    console.log('Kafka producer and consumer disconnected');
  }

  async sendMessage(topic: string, message: string) {
    await this.producer.send({
      topic,
      messages: [{ value: message }],
    });
  }
}
