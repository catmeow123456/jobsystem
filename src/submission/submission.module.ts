import { Module } from '@nestjs/common';
import { SubmissionController } from './submission.controller';
import { SubmissionService } from './submission.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [SubmissionService, PrismaService],
  controllers: [SubmissionController]
})
export class SubmissionModule {}
