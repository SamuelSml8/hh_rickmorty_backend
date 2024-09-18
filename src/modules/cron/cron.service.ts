import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CharactersService } from '../characters/services/characters.service';

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);

  constructor(private readonly charactersService: CharactersService) {}

  @Cron(CronExpression.EVERY_30_MINUTES)
  async handleCron() {
    this.logger.log('Running cron job to refresh characters every 30 minutes');
    try {
      await this.charactersService.refreshCharacters();
    } catch (error) {
      this.logger.error(
        'Error occurred while refreshing characters',
        error.stack,
      );
    }
  }
}
