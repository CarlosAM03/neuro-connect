import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiResponse,
} from '@nestjs/swagger';
import {
  SafeUserResponse,
  TokenResponse,
  ErrorResponse,
} from '../common/response.dto';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { CurrentUser, Public, SafeUser } from './auth.guard';
import { LoginDto, RegisterDto } from './auth.dto';
import { AuthService } from './auth.service';

@ApiTags('Auth')
@ApiResponse({ status: 400, type: ErrorResponse })
@ApiResponse({ status: 401, type: ErrorResponse })
@ApiResponse({ status: 409, type: ErrorResponse })
@ApiResponse({ status: 429, type: ErrorResponse })
@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}
  @Public()
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @Post('register')
  @ApiCreatedResponse({ type: SafeUserResponse })
  register(@Body() dto: RegisterDto) {
    return this.auth.register(dto);
  }
  @Public()
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @Post('login')
  @HttpCode(200)
  @ApiOkResponse({ type: TokenResponse })
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto);
  }
  @ApiOkResponse({ type: SafeUserResponse })
  @ApiBearerAuth()
  @Get('me')
  me(@CurrentUser() user: SafeUser) {
    return user;
  }
}
