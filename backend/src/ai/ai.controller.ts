import { Controller, Get } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser, SafeUser } from '../auth/auth.guard';
import { ErrorResponse } from '../common/response.dto';
import { AiSummaryService } from './ai-summary.service';
import { AiPreviewResponse } from './summary-context.dto';

@ApiTags('AI Preview — development only')
@ApiBearerAuth()
@ApiResponse({ status: 401, type: ErrorResponse })
@Controller('ai/summary')
export class AiController {
  constructor(private readonly summaries: AiSummaryService) {}
  @Get('context')
  @ApiOperation({
    summary: 'Vista previa técnica: contexto y prompt, sin IA real',
    description:
      'Development preview only. Owner data from Analytics, no provider call, no persistence. providerConfigured=false. Disabled when AI_PREVIEW_ENABLED=false.',
  })
  @ApiOkResponse({ type: AiPreviewResponse })
  @ApiResponse({
    status: 404,
    type: ErrorResponse,
    description: 'Technical preview disabled',
  })
  preview(@CurrentUser() user: SafeUser) {
    return this.summaries.preview(user.id);
  }
}
