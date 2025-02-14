import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JobStatus, Submission } from '@prisma/client';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { KafkaService } from '../kafka/kafka.service';

@Injectable()
export class SubmissionService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly kafkaService: KafkaService,
  ) {}

  async findAll(): Promise<Submission[]> {
    return this.prismaService.submission.findMany();
  }

  async create(submission: Submission): Promise<Submission> {
    return this.prismaService.submission.create({ data: submission });
  }

  async createSubmission(dto: CreateSubmissionDto): Promise<Submission> {
    const submission: Submission = await this.prismaService.submission
      .create({
        data: {
          ...dto,
          status: JobStatus.pending,
        },
      })
      .catch((error) => {
        throw new Error(`Failed to create submission: ${error}`);
      });
    await this.kafkaService.sendMessage(
      'submission.created',
      JSON.stringify(submission),
    );
    return submission;
  }
}
