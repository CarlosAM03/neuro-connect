import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PrismaService } from '../prisma/prisma.service';
import { Public } from '../auth/auth.guard';

@ApiTags('Health')
@Public()
@Controller('health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}
  @Get() health() {
    return { status: 'ok' };
  }
  @Get('ready') async ready() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return { status: 'ok', database: 'reachable' };
    } catch {
      throw new ServiceUnavailableException('Database unavailable');
    }
  }
}
