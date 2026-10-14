import { Body, Controller, Get, Patch } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOkResponse,
  ApiResponse,
} from '@nestjs/swagger';
import { SafeUserResponse, ErrorResponse } from '../common/response.dto';
import { CurrentUser, SafeUser } from '../auth/auth.guard';
import { UpdateProfileDto } from '../auth/auth.dto';
import { UsersService } from './users.service';

@ApiTags('Users')
@ApiBearerAuth()
@ApiResponse({ status: 400, type: ErrorResponse })
@ApiResponse({ status: 401, type: ErrorResponse })
@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService) {}
  @ApiOkResponse({ type: SafeUserResponse })
  @Get('me')
  me(@CurrentUser() user: SafeUser) {
    return this.users.profile(user.id);
  }
  @ApiOkResponse({ type: SafeUserResponse })
  @Patch('me')
  update(@CurrentUser() user: SafeUser, @Body() dto: UpdateProfileDto) {
    return this.users.update(user.id, dto);
  }
}
