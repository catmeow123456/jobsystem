import { Test, TestingModule } from '@nestjs/testing';
import { SubmissionController } from './submission.controller';
import { SubmissionService } from './submission.service';
import { PrismaService } from '../prisma/prisma.service';
import { KafkaService } from '../kafka/kafka.service';

describe('SubmissionController', () => {
  let controller: SubmissionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubmissionService, PrismaService, KafkaService],
      controllers: [SubmissionController],
    }).compile();

    controller = module.get<SubmissionController>(SubmissionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
