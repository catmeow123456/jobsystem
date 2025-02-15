import { Test, TestingModule } from '@nestjs/testing';
import { TaskEnvService } from './task-env.service';
import { PrismaService } from '../prisma/prisma.service';
import { DockerService } from '../docker/docker.service';
import { KafkaService } from '../kafka/kafka.service';

describe('TaskEnvService', () => {
  let service: TaskEnvService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TaskEnvService, PrismaService, KafkaService, DockerService],
    }).compile();

    service = module.get<TaskEnvService>(TaskEnvService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
