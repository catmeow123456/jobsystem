import { Test, TestingModule } from '@nestjs/testing';
import { SubmissionService } from './submission.service';
import { PrismaService } from '../prisma/prisma.service';
import { KafkaService } from '../kafka/kafka.service';
import { DockerService } from '../docker/docker.service';

describe('SubmissionService', () => {
  let service: SubmissionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubmissionService,
        PrismaService,
        KafkaService,
        DockerService,
      ],
    }).compile();

    service = module.get<SubmissionService>(SubmissionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
