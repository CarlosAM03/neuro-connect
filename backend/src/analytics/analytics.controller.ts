import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser, SafeUser } from '../auth/auth.guard';
import { ErrorResponse } from '../common/response.dto';
import { GoalAnalyticsResponse, OverviewResponse } from './analytics.dto';
import { AnalyticsService } from './analytics.service';

@ApiTags('Analytics')
@ApiBearerAuth()
@ApiResponse({ status: 401, type: ErrorResponse })
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analytics: AnalyticsService) {}
  @Get('overview')
  @ApiOkResponse({ type: OverviewResponse })
  overview(@CurrentUser() user: SafeUser) {
    return this.analytics.overview(user.id);
  }
  @Get('goals/:goalId')
  @ApiOkResponse({ type: GoalAnalyticsResponse })
  @ApiResponse({ status: 400, type: ErrorResponse })
  @ApiResponse({ status: 404, type: ErrorResponse })
  goal(
    @CurrentUser() user: SafeUser,
    @Param('goalId', ParseUUIDPipe) id: string,
  ) {
    return this.analytics.goal(user.id, id);
  }
}
