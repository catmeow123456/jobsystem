import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JobStatus, Submission } from '@prisma/client';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class SubmissionService {
  constructor(
    private prismaService: PrismaService,
    @Inject('KAFKA_SERVICE') private kafkaProducer: ClientKafka,
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
      })
      .then((submission) => {
        this.kafkaProducer.emit('submission.created', {
          value: JSON.stringify(submission),
        });
        return submission;
      });
    return submission;
  }
}
