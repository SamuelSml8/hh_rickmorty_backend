import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CharactersService } from '../characters/services/characters.service';

@Injectable()
export class CronService {
  constructor(private readonly charactersService: CharactersService) {}

  @Cron(CronExpression.EVERY_30_MINUTES)
  async handleCron() {
    console.log('Running cron job to refresh characters every 30 minutes');
    await this.charactersService.refreshCharacters();
  }
}
