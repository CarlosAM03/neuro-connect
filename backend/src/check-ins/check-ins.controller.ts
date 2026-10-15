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
import {
  ApiBearerAuth,
  ApiTags,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { CheckInResponse, ErrorResponse } from '../common/response.dto';
import { CurrentUser, SafeUser } from '../auth/auth.guard';
import { CreateCheckInDto } from './check-in.dto';
import { CheckInsService } from './check-ins.service';

@ApiTags('CheckIns')
@ApiBearerAuth()
@ApiResponse({ status: 400, type: ErrorResponse })
@ApiResponse({ status: 401, type: ErrorResponse })
@ApiResponse({ status: 404, type: ErrorResponse })
@ApiResponse({ status: 409, type: ErrorResponse })
@Controller('goals/:goalId/check-ins')
export class CheckInsController {
  constructor(private readonly checkIns: CheckInsService) {}
  @ApiCreatedResponse({ type: CheckInResponse })
  @Post()
  create(
    @CurrentUser() user: SafeUser,
    @Param('goalId', ParseUUIDPipe) goalId: string,
    @Body() dto: CreateCheckInDto,
  ) {
    return this.checkIns.create(user.id, goalId, dto);
  }
  @ApiOkResponse({ type: [CheckInResponse] })
  @Get()
  history(
    @CurrentUser() user: SafeUser,
    @Param('goalId', ParseUUIDPipe) goalId: string,
  ) {
    return this.checkIns.history(user.id, goalId);
  }
  @ApiOkResponse({ type: CheckInResponse })
  @Get(':checkInId')
  detail(
    @CurrentUser() user: SafeUser,
    @Param('goalId', ParseUUIDPipe) goalId: string,
    @Param('checkInId', ParseUUIDPipe) id: string,
  ) {
    return this.checkIns.detail(user.id, goalId, id);
  }
  @Post(':checkInId/void')
  @HttpCode(204)
  @ApiNoContentResponse({
    description:
      'Invalidated, retained; effective progress recalculated atomically.',
  })
  void(
    @CurrentUser() user: SafeUser,
    @Param('goalId', ParseUUIDPipe) goalId: string,
    @Param('checkInId', ParseUUIDPipe) id: string,
  ) {
    return this.checkIns.delete(user.id, goalId, id);
  }
  @ApiOperation({
    deprecated: true,
    description: 'Compatibility alias for void. No rows are deleted.',
  })
  @ApiNoContentResponse({
    description: 'CheckIn invalidated and effective progress recalculated',
  })
  @Delete(':checkInId')
  @HttpCode(204)
  delete(
    @CurrentUser() user: SafeUser,
    @Param('goalId', ParseUUIDPipe) goalId: string,
    @Param('checkInId', ParseUUIDPipe) id: string,
  ) {
    return this.checkIns.delete(user.id, goalId, id);
  }
}
