import {
  Body,
  Controller,
  Get,
  HttpCode,
  Module,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  PickType,
  OmitType,
  ApiProperty,
} from '@nestjs/swagger';
import { CurrentUser, SafeUser } from '../auth/auth.guard';
import { GoalResponse } from '../common/response.dto';
import {
  GoalAnalyticsResponse,
  TimelinePointResponse,
} from '../analytics/analytics.dto';
import { CheckInCompletion } from '@prisma/client';
import { SupportAccessService } from './support-access.service';
import { SupportNetworkService } from './support-network.service';
import {
  CreateSupportDto,
  SupportPermissionsDto,
  SupportRelationshipResponse,
  UpdateSupportDto,
} from './support.dto';

class SharedGoalResponse extends PickType(GoalResponse, [
  'id',
  'title',
  'description',
  'category',
  'status',
  'progress',
  'targetDate',
] as const) {}
class SharedTimelinePointResponse extends TimelinePointResponse {
  @ApiProperty({ minimum: 1, maximum: 5 }) difficulty!: number;
  @ApiProperty({ enum: CheckInCompletion }) completion!: CheckInCompletion;
}
class SharedProgressResponse extends OmitType(GoalAnalyticsResponse, [
  'timeline',
] as const) {
  @ApiProperty({ type: [SharedTimelinePointResponse] })
  timeline!: SharedTimelinePointResponse[];
}

@ApiTags('Support network')
@ApiBearerAuth()
@Controller('support-network')
class SupportNetworkController {
  constructor(private readonly network: SupportNetworkService) {}
  @Post('relationships')
  @ApiCreatedResponse({ type: SupportRelationshipResponse })
  create(@CurrentUser() u: SafeUser, @Body() dto: CreateSupportDto) {
    return this.network.create(u.id, dto);
  }
  @Get('relationships')
  @ApiOkResponse({ type: [SupportRelationshipResponse] })
  list(@CurrentUser() u: SafeUser) {
    return this.network.list(u.id);
  }
  @Get('relationships/:relationshipId')
  @ApiOkResponse({ type: SupportRelationshipResponse })
  detail(
    @CurrentUser() u: SafeUser,
    @Param('relationshipId', ParseUUIDPipe) id: string,
  ) {
    return this.network.detail(u.id, id);
  }
  @Patch('relationships/:relationshipId')
  @ApiOkResponse({ type: SupportRelationshipResponse })
  @ApiOperation({
    description:
      'Owner updates individual permissions and/or expiration. Invalid dependencies return 400. Authorization changes apply to the next delegated request.',
  })
  update(
    @CurrentUser() u: SafeUser,
    @Param('relationshipId', ParseUUIDPipe) id: string,
    @Body() dto: UpdateSupportDto,
  ) {
    return this.network.update(u.id, id, dto);
  }
  @Post('relationships/:relationshipId/revoke')
  @HttpCode(200)
  @ApiOkResponse({ type: SupportRelationshipResponse })
  revoke(
    @CurrentUser() u: SafeUser,
    @Param('relationshipId', ParseUUIDPipe) id: string,
  ) {
    return this.network.revoke(u.id, id);
  }
  @Post('relationships/:relationshipId/reactivate')
  @HttpCode(200)
  @ApiOkResponse({ type: SupportRelationshipResponse })
  reactivate(
    @CurrentUser() u: SafeUser,
    @Param('relationshipId', ParseUUIDPipe) id: string,
    @Body() dto: SupportPermissionsDto,
  ) {
    return this.network.reactivate(u.id, id, dto);
  }
  @Get('owners')
  @ApiOkResponse({
    description:
      'Active supported owners only: relationship id, owner {id,displayName}, permission booleans and expiresAt.',
  })
  owners(@CurrentUser() u: SafeUser) {
    return this.network.owners(u.id);
  }
  @Get('supporting')
  @ApiOperation({
    deprecated: true,
    description: 'Alias for GET /support-network/owners (ADR-008).',
  })
  supporting(@CurrentUser() u: SafeUser) {
    return this.network.owners(u.id);
  }
  @Get('owners/:ownerId/goals')
  @ApiOkResponse({
    type: [SharedGoalResponse],
    description:
      'VIEW_GOALS; includes CANCELLED. No notes, history, owner identity or credentials.',
  })
  goals(
    @CurrentUser() u: SafeUser,
    @Param('ownerId', ParseUUIDPipe) owner: string,
  ) {
    return this.network.goals(u.id, owner);
  }
  @Get('owners/:ownerId/goals/:goalId')
  @ApiOkResponse({ type: SharedGoalResponse })
  goal(
    @CurrentUser() u: SafeUser,
    @Param('ownerId', ParseUUIDPipe) owner: string,
    @Param('goalId', ParseUUIDPipe) goal: string,
  ) {
    return this.network.goal(u.id, owner, goal);
  }
  @Get('owners/:ownerId/goals/:goalId/progress')
  @ApiOkResponse({
    type: SharedProgressResponse,
    description:
      'VIEW_PROGRESS; timeline additionally includes difficulty and completion, never notes or voided records.',
  })
  progress(
    @CurrentUser() u: SafeUser,
    @Param('ownerId', ParseUUIDPipe) owner: string,
    @Param('goalId', ParseUUIDPipe) goal: string,
  ) {
    return this.network.progress(u.id, owner, goal);
  }
  @Get('owners/:ownerId/summaries')
  @ApiOkResponse({
    description:
      'VIEW_SUMMARIES; empty collection until productive AI summaries are implemented.',
    schema: { type: 'array', items: { type: 'object' } },
  })
  summaries(
    @CurrentUser() u: SafeUser,
    @Param('ownerId', ParseUUIDPipe) owner: string,
  ) {
    return this.network.summaries(u.id, owner);
  }
}
@Module({
  providers: [SupportAccessService, SupportNetworkService],
  controllers: [SupportNetworkController],
})
export class SupportNetworkModule {}
