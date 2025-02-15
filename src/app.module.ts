import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TaskModule } from './task/task.module';
import { PrismaService } from './prisma/prisma.service';
import { SubmissionModule } from './submission/submission.module';
import { KafkaService } from './kafka/kafka.service';
import { TaskEnvModule } from './task-env/task-env.module';
import { DockerService } from './docker/docker.service';

@Module({
  imports: [TaskModule, SubmissionModule, TaskEnvModule],
  controllers: [AppController],
  providers: [AppService, PrismaService, KafkaService, DockerService],
})
export class AppModule {}
