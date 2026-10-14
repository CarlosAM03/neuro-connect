import { Module } from '@nestjs/common';
import { GoalsModule } from '../goals/goals.module';
import { CheckInsController } from './check-ins.controller';
import { CheckInsService } from './check-ins.service';
@Module({
  imports: [GoalsModule],
  controllers: [CheckInsController],
  providers: [CheckInsService],
})
export class CheckInsModule {}
