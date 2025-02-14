import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Task } from '@prisma/client';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TaskService {
  constructor(private prismaService: PrismaService) {}

  async findAll(): Promise<Task[]> {
    return this.prismaService.task.findMany();
  }
  async create(task: Task): Promise<Task> {
    return this.prismaService.task.create({ data: task });
  }
  async createTask(dto: CreateTaskDto): Promise<Task> {
    return this.prismaService.task.create({ data: dto });
  }
}
