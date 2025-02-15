import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import { PrismaService } from '../prisma/prisma.service';
import { DockerService } from '../docker/docker.service';

describe('TaskService', () => {
  let service: TaskService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TaskService, PrismaService, DockerService],
    }).compile();

    service = module.get<TaskService>(TaskService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
