import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { Character } from 'src/entities/character.entity';
import { ResponseApiHh } from 'src/utils/interfaces/response.interface';
import { createResponse } from 'src/utils/response.util';
import { Repository } from 'typeorm';

@Injectable()
export class CharactersService {
  constructor(
    @InjectRepository(Character)
    private readonly characterRepository: Repository<Character>,
  ) {}

  async importCharacters(): Promise<ResponseApiHh<Character[]>> {
    try {
      const characters: Character[] = [];

      let page = 1;
      const pageSize = 20;
      const maxCharacters = 200;

      while (characters.length < maxCharacters) {
        const response = await axios.get(
          `https://rickandmortyapi.com/api/character/?page=${page}`,
        );
        const data = response.data;

        if (!data.results || !Array.isArray(data.results)) {
          throw new HttpException(
            createResponse(false, 'Unexpected data format from API', null),
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }

        const newCharacters = data.results.map((character: any) => ({
          id: character.id,
          name: character.name,
          status: character.status,
          species: character.species,
          type: character.type || '',
          gender: character.gender,
          image: character.image,
        }));

        characters.push(...newCharacters);

        if (
          newCharacters.length < pageSize ||
          characters.length >= maxCharacters
        ) {
          break;
        }

        page++;
      }

      const truncatedCharacters = characters.slice(0, maxCharacters);

      await this.characterRepository.upsert(truncatedCharacters, ['id']);

      return createResponse(
        true,
        'Characters imported successfully',
        truncatedCharacters,
      );
    } catch (error) {
      console.error('Error importing characters:', error.message);
      return createResponse(false, 'Failed to import characters', []);
    }
  }

  async getCharactersByName(
    name: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<ResponseApiHh<Character[]>> {
    try {
      if (page < 1) page = 1;
      if (limit < 1) limit = 20;

      const characters = await this.characterRepository
        .createQueryBuilder('character')
        .where('character.name ILIKE :name', { name: `%${name}%` })
        .skip((page - 1) * limit)
        .take(limit)
        .getMany();

      if (!characters.length) {
        return createResponse(false, 'No characters found', []);
      }

      return createResponse(true, 'Characters found', characters);
    } catch (error) {
      console.error('Error retrieving characters:', error.message);
      return createResponse(false, 'Failed to retrieve characters', []);
    }
  }

  async refreshCharacters(): Promise<ResponseApiHh<Character[]>> {
    try {
      const refreshData = await this.importCharacters();
      if (!refreshData.ok) {
        throw new Error('Failed to import characters');
      }

      return createResponse(
        true,
        'Characters refreshed successfully',
        refreshData.data,
      );
    } catch (error) {
      console.error('Error refreshing characters:', error.message);
      return createResponse(false, 'Failed to refresh characters', []);
    }
  }
}
