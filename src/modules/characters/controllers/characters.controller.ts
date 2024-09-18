import { Controller, Get, HttpStatus, Post, Query } from '@nestjs/common';
import { CharactersService } from '../services/characters.service';
import { ResponseApiHh } from 'src/utils/interfaces/response.interface';
import { Character } from 'src/entities/character.entity';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Characters')
@Controller('characters')
export class CharactersController {
  constructor(private readonly charactersService: CharactersService) {}

  @ApiOperation({
    summary: 'Import 200 characters from the Rick and Morty API',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully imported characters',
    schema: {
      example: {
        ok: true,
        message: 'Characters imported successfully',
        data: [
          {
            id: 1,
            name: 'Rick Sanchez',
            status: 'Alive',
            species: 'Human',
            type: '',
            gender: 'Male',
            image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Failed to import characters',
    schema: {
      example: {
        ok: false,
        message: 'Failed to import characters',
        data: [],
      },
    },
  })
  @Post('import')
  async importCharacters(): Promise<ResponseApiHh<Character[]>> {
    return this.charactersService.importCharacters();
  }

  @ApiOperation({ summary: 'Filter characters by name with pagination' })
  @ApiQuery({
    name: 'name',
    required: true,
    description: 'Name of the character to search for',
    example: 'Rick',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number for pagination',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of items per page',
    example: 20,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully retrieved characters',
    schema: {
      example: {
        ok: true,
        message: 'Characters found',
        data: [
          {
            id: 1,
            name: 'Rick Sanchez',
            status: 'Alive',
            species: 'Human',
            type: '',
            gender: 'Male',
            image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No characters found matching the query',
    schema: {
      example: {
        ok: false,
        message: 'No characters found',
        data: [],
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid query parameters',
    schema: {
      example: {
        ok: false,
        message: 'Failed to retrieve characters',
        data: [],
      },
    },
  })
  @Get('')
  async getCharactersByName(
    @Query('name') name: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ): Promise<
    ResponseApiHh<{
      characters: Character[];
      total: number;
      page: number;
      limit: number;
    }>
  > {
    return this.charactersService.getCharactersByName(name, page, limit);
  }

  @ApiOperation({
    summary:
      'Refresh the characters database by re-importing characters from the API',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully refreshed the characters database',
    schema: {
      example: {
        ok: true,
        message: 'Characters refreshed successfully',
        data: [
          {
            id: 1,
            name: 'Rick Sanchez',
            status: 'Alive',
            species: 'Human',
            type: '',
            gender: 'Male',
            image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Failed to refresh the characters database',
    schema: {
      example: {
        ok: false,
        message: 'Failed to refresh characters',
        data: [],
      },
    },
  })
  @Post('refresh')
  async refreshCharacters(): Promise<ResponseApiHh<Character[]>> {
    return this.charactersService.refreshCharacters();
  }
}
