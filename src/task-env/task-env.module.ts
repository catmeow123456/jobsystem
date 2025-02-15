import { Module } from '@nestjs/common';
import { TaskEnvService } from './task-env.service';
import { TaskEnvController } from './task-env.controller';
import { PrismaService } from '../prisma/prisma.service';
import { KafkaService } from '../kafka/kafka.service';
import { DockerService } from '../docker/docker.service';

@Module({
  providers: [TaskEnvService, PrismaService, DockerService, KafkaService],
  controllers: [TaskEnvController],
})
export class TaskEnvModule {}
