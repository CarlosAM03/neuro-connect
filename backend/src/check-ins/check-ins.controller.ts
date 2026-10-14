import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser, SafeUser } from '../auth/auth.guard';
import { CreateCheckInDto } from './check-in.dto';
import { CheckInsService } from './check-ins.service';

@ApiTags('CheckIns')
@ApiBearerAuth()
@Controller('goals/:goalId/check-ins')
export class CheckInsController {
  constructor(private readonly checkIns: CheckInsService) {}
  @Post() create(
    @CurrentUser() user: SafeUser,
    @Param('goalId', ParseUUIDPipe) goalId: string,
    @Body() dto: CreateCheckInDto,
  ) {
    return this.checkIns.create(user.id, goalId, dto);
  }
  @Get() history(
    @CurrentUser() user: SafeUser,
    @Param('goalId', ParseUUIDPipe) goalId: string,
  ) {
    return this.checkIns.history(user.id, goalId);
  }
  @Get(':checkInId') detail(
    @CurrentUser() user: SafeUser,
    @Param('goalId', ParseUUIDPipe) goalId: string,
    @Param('checkInId', ParseUUIDPipe) id: string,
  ) {
    return this.checkIns.detail(user.id, goalId, id);
  }
  @Delete(':checkInId') @HttpCode(204) delete(
    @CurrentUser() user: SafeUser,
    @Param('goalId', ParseUUIDPipe) goalId: string,
    @Param('checkInId', ParseUUIDPipe) id: string,
  ) {
    return this.checkIns.delete(user.id, goalId, id);
  }
}
