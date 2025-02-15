import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TaskEnv, TaskEnvStatus } from '@prisma/client';
import { CreateTaskEnvDto } from './dto/create-task-env.dto';
import { KafkaService } from '../kafka/kafka.service';

@Injectable()
export class TaskEnvService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly kafkaService: KafkaService,
  ) {}

  async findAll(): Promise<TaskEnv[]> {
    return this.prismaService.taskEnv.findMany();
  }

  async create(taskEnv: TaskEnv): Promise<TaskEnv> {
    return this.prismaService.taskEnv.create({ data: taskEnv });
  }

  async createTaskEnv(dto: CreateTaskEnvDto): Promise<TaskEnv> {
    // 检查 fatherTaskEnv 是否存在
    let fatherTaskEnv: TaskEnv | null = null;
    const { fatherName, ...dtoRest } = dto;
    if (fatherName) {
      fatherTaskEnv = await this.prismaService.taskEnv.findUnique({
        where: { name: fatherName },
      });
      if (!fatherTaskEnv) {
        throw new Error(`Father TaskEnv ${fatherName} not found`);
      }
    }
    // 如果存在，创建 TaskEnv 时关联 fatherTaskEnv
    const newTaskEnv: TaskEnv = await this.prismaService.taskEnv.create({
      data: {
        ...dtoRest,
        status: TaskEnvStatus.inactive,
        father: fatherTaskEnv ? { connect: { name: fatherName } } : undefined,
      },
    });
    return newTaskEnv;
  }

  async buildImage(taskEnvName: string): Promise<void> {
    const taskEnv: TaskEnv | null = await this.prismaService.taskEnv.findUnique(
      {
        where: { name: taskEnvName },
      },
    );
    if (!taskEnv) {
      throw new Error(`TaskEnv ${taskEnvName} not found`);
    }
    if (taskEnv.status === TaskEnvStatus.active) {
      throw new Error(`TaskEnv ${taskEnvName} is already active`);
    }
    await this.kafkaService.sendMessage(
      'taskEnv.created',
      JSON.stringify(taskEnv),
    );
  }
}
