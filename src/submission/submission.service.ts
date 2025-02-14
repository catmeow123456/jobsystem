import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Submission } from '@prisma/client';

@Injectable()
export class SubmissionService {
    constructor(private prismaService: PrismaService) {}

    async findAll(): Promise<Submission[]> {
        return this.prismaService.submission.findMany();
    }

    async create(submission: Submission): Promise<Submission> {
        return this.prismaService.submission.create({ data: submission });
    }
}
