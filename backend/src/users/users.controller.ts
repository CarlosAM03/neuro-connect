import { Body, Controller, Get, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser, SafeUser } from '../auth/auth.guard';
import { UpdateProfileDto } from '../auth/auth.dto';
import { UsersService } from './users.service';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService) {}
  @Get('me') me(@CurrentUser() user: SafeUser) {
    return this.users.profile(user.id);
  }
  @Patch('me') update(
    @CurrentUser() user: SafeUser,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.users.update(user.id, dto);
  }
}
