import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  ServiceUnavailableException,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser, SafeUser } from '../auth/auth.guard';
import { AiSummaryService } from './ai-summary.service';
import { SummaryReadResponse } from './summary-read.dto';

@ApiTags('AI summaries — generation unavailable')
@ApiBearerAuth()
@Controller('ai/summaries')
export class SummaryReadController {
  constructor(private readonly summaries: AiSummaryService) {}
  @Get()
  @ApiOkResponse({ type: [SummaryReadResponse] })
  list(@CurrentUser() user: SafeUser) {
    return this.summaries.list(user.id);
  }
  @Get(':summaryId')
  @ApiOkResponse({ type: SummaryReadResponse })
  detail(
    @CurrentUser() user: SafeUser,
    @Param('summaryId', ParseUUIDPipe) id: string,
  ) {
    return this.summaries.detail(user.id, id);
  }
  @Post()
  @ApiResponse({
    status: 503,
    description: 'No real provider configured; nothing generated or persisted.',
  })
  generate() {
    throw new ServiceUnavailableException(
      'Resúmenes generados por IA aún no disponibles',
    );
  }
}
