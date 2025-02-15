import { Module } from '@nestjs/common';
import { TaskEnvService } from './task-env.service';
import { TaskEnvController } from './task-env.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [TaskEnvService, PrismaService],
  controllers: [TaskEnvController],
})
export class TaskEnvModule {}
