import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validateEnvironment } from './config/environment';
import { PrismaModule } from './prisma/prisma.service';
import { HealthController } from './health/health.controller';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { GoalsModule } from './goals/goals.module';
import { CheckInsModule } from './check-ins/check-ins.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { AiModule } from './ai/ai.module';
import { AuditModule } from './audit/audit.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate: validateEnvironment }),
    PrismaModule,
    AuthModule,
    UsersModule,
    GoalsModule,
    CheckInsModule,
    AnalyticsModule,
    AiModule,
    AuditModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
