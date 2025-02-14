import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Task } from '@prisma/client';

@Injectable()
export class TaskService {
  constructor(private prismaService: PrismaService) {}

  async findAll(): Promise<Task[]> {
    return this.prismaService.task.findMany();
  }
  async create(task: Task): Promise<Task> {
    return this.prismaService.task.create({ data: task });
  }
}
