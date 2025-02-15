import { Test, TestingModule } from '@nestjs/testing';
import { TaskEnvController } from './task-env.controller';
import { TaskEnvService } from './task-env.service';
import { KafkaService } from '../kafka/kafka.service';
import { DockerService } from '../docker/docker.service';
import { PrismaService } from '../prisma/prisma.service';

describe('TaskEnvController', () => {
  let controller: TaskEnvController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TaskEnvService, PrismaService, KafkaService, DockerService],
      controllers: [TaskEnvController],
    }).compile();

    controller = module.get<TaskEnvController>(TaskEnvController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
