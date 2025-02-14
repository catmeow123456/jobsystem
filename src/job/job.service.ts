import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Job } from '@prisma/client';

@Injectable()
export class JobService {
  constructor(private prismaService: PrismaService) {}

  async findAll(): Promise<Job[]> {
    return this.prismaService.job.findMany();
  }
  async create(job: Job): Promise<Job> {
    return this.prismaService.job.create({ data: job });
  }
}
