import { Controller, Get, ParseIntPipe, Post, Query } from '@nestjs/common';
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

  @Get('')
  async getCharactersByName(
    @Query('name') name: string,
    @Query('page')
    page: number = 1,
    @Query('limit')
    limit: number = 20,
  ): Promise<ResponseApiHh<Character[]>> {
    return this.charactersService.getCharactersByName(name, page, limit);
  }

  @Post('refresh')
  async refreshCharacters(): Promise<ResponseApiHh<Character[]>> {
    return this.charactersService.refreshCharacters();
  }
}
