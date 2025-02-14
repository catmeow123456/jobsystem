import { Body, Controller, Post } from '@nestjs/common';
import { SubmissionService } from './submission.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';

@Controller('submission')
export class SubmissionController {
  constructor(private submissionService: SubmissionService) {}
  @Post()
  async createSubmission(@Body() dto: CreateSubmissionDto) {
    return this.submissionService.createSubmission(dto);
  }
}
