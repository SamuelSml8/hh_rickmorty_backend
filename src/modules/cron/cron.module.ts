import { Module } from '@nestjs/common';
import { CronService } from './cron.service';
import { CharactersModule } from '../characters/characters.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [ScheduleModule.forRoot(), CharactersModule],
  providers: [CronService],
})
export class CronModule {}
