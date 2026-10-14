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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser, SafeUser } from '../auth/auth.guard';
import { CreateGoalDto, UpdateGoalDto } from './goal.dto';
import { GoalsService } from './goals.service';

@ApiTags('Goals')
@ApiBearerAuth()
@Controller('goals')
export class GoalsController {
  constructor(private readonly goals: GoalsService) {}
  @Post() create(@CurrentUser() user: SafeUser, @Body() dto: CreateGoalDto) {
    return this.goals.create(user.id, dto);
  }
  @Get() list(@CurrentUser() user: SafeUser) {
    return this.goals.list(user.id);
  }
  @Get(':goalId') detail(
    @CurrentUser() user: SafeUser,
    @Param('goalId', ParseUUIDPipe) id: string,
  ) {
    return this.goals.detail(user.id, id);
  }
  @Patch(':goalId') update(
    @CurrentUser() user: SafeUser,
    @Param('goalId', ParseUUIDPipe) id: string,
    @Body() dto: UpdateGoalDto,
  ) {
    return this.goals.update(user.id, id, dto);
  }
  @Delete(':goalId') @HttpCode(204) delete(
    @CurrentUser() user: SafeUser,
    @Param('goalId', ParseUUIDPipe) id: string,
  ) {
    return this.goals.delete(user.id, id);
  }
}
