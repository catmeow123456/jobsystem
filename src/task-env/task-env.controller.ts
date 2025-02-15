import { Body, Controller, Post } from '@nestjs/common';
import { TaskEnvService } from './task-env.service';
import { CreateTaskEnvDto } from './dto/create-task-env.dto';
import { TaskEnv } from '@prisma/client';

@Controller('task-env')
export class TaskEnvController {
  constructor(private readonly taskEnvService: TaskEnvService) {}

  @Post('create')
  async createTaskEnv(@Body() dto: CreateTaskEnvDto): Promise<TaskEnv> {
    return this.taskEnvService.createTaskEnv(dto).catch((error) => {
      throw `Failed to create task environment: ${error}`;
    });
  }
}
