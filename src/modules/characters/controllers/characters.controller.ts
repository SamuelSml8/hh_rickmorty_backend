import { Controller, Get, Post } from '@nestjs/common';
import { CharactersService } from '../services/characters.service';
import { ResponseApiHh } from 'src/utils/interfaces/response.interface';
import { Character } from 'src/entities/character.entity';

@Controller('characters')
export class CharactersController {
  constructor(private readonly charactersService: CharactersService) {}

  @Post('import')
  async importCharacters(): Promise<ResponseApiHh<Character[]>> {
    return this.charactersService.importCharacters();
  }
}
