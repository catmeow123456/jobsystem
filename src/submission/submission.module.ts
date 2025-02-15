import { Module } from '@nestjs/common';
import { SubmissionController } from './submission.controller';
import { SubmissionService } from './submission.service';
import { PrismaService } from '../prisma/prisma.service';
import { KafkaService } from '../kafka/kafka.service';
import { DockerService } from '../docker/docker.service';

@Module({
  providers: [SubmissionService, PrismaService, DockerService, KafkaService],
  controllers: [SubmissionController],
})
export class SubmissionModule {}
