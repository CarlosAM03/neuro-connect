import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { GoalResponse, ErrorResponse } from '../common/response.dto';
import { CurrentUser, SafeUser } from '../auth/auth.guard';
import { CreateGoalDto, UpdateGoalDto } from './goal.dto';
import { GoalsService } from './goals.service';

@ApiTags('Goals')
@ApiBearerAuth()
@ApiResponse({ status: 400, type: ErrorResponse })
@ApiResponse({ status: 401, type: ErrorResponse })
@ApiResponse({ status: 404, type: ErrorResponse })
@ApiResponse({ status: 409, type: ErrorResponse })
@Controller('goals')
export class GoalsController {
  constructor(private readonly goals: GoalsService) {}
  @ApiCreatedResponse({ type: GoalResponse })
  @Post()
  create(@CurrentUser() user: SafeUser, @Body() dto: CreateGoalDto) {
    return this.goals.create(user.id, dto);
  }
  @ApiOkResponse({ type: [GoalResponse] })
  @Get()
  list(@CurrentUser() user: SafeUser) {
    return this.goals.list(user.id);
  }
  @ApiOkResponse({ type: GoalResponse })
  @Get(':goalId')
  detail(
    @CurrentUser() user: SafeUser,
    @Param('goalId', ParseUUIDPipe) id: string,
  ) {
    return this.goals.detail(user.id, id);
  }
  @ApiOkResponse({ type: GoalResponse })
  @Patch(':goalId')
  update(
    @CurrentUser() user: SafeUser,
    @Param('goalId', ParseUUIDPipe) id: string,
    @Body() dto: UpdateGoalDto,
  ) {
    return this.goals.update(user.id, id, dto);
  }
  @Post(':goalId/cancel')
  @HttpCode(200)
  @ApiOkResponse({
    type: GoalResponse,
    description: 'Cancel without removing history; only ACTIVE or PAUSED.',
  })
  cancel(
    @CurrentUser() user: SafeUser,
    @Param('goalId', ParseUUIDPipe) id: string,
  ) {
    return this.goals.update(user.id, id, { status: 'CANCELLED' });
  }
  @Post(':goalId/reactivate')
  @HttpCode(200)
  @ApiOkResponse({ type: GoalResponse })
  reactivate(
    @CurrentUser() user: SafeUser,
    @Param('goalId', ParseUUIDPipe) id: string,
  ) {
    return this.goals.update(user.id, id, { status: 'ACTIVE' });
  }
  @ApiOperation({
    deprecated: true,
    description: 'Compatibility alias for cancel. No rows are deleted.',
  })
  @ApiNoContentResponse({
    description: 'Goal cancelled; all history preserved',
  })
  @Delete(':goalId')
  @HttpCode(204)
  delete(
    @CurrentUser() user: SafeUser,
    @Param('goalId', ParseUUIDPipe) id: string,
  ) {
    return this.goals.delete(user.id, id);
  }
}
