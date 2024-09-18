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
            createResponse(
              false,
              'Unexpected data format from Rick and Morty API',
              null,
            ),
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
      if (error instanceof HttpException) {
        throw error;
      }

      console.error('Error importing characters:', error.message);
      throw new HttpException(
        createResponse(false, 'Failed to import characters', []),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getCharactersByName(
    name: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<
    ResponseApiHh<{
      characters: Character[];
      total: number;
      page: number;
      limit: number;
    }>
  > {
    try {
      if (page < 1) page = 1;
      if (limit < 1) limit = 20;

      let characters: Character[];
      let total: number;

      if (!name) {
        [characters, total] = await this.characterRepository.findAndCount({
          skip: (page - 1) * limit,
          take: limit,
        });
      } else {
        characters = await this.characterRepository
          .createQueryBuilder('character')
          .where('character.name ILIKE :name', { name: `%${name}%` })
          .skip((page - 1) * limit)
          .take(limit)
          .getMany();

        total = await this.characterRepository
          .createQueryBuilder('character')
          .where('character.name ILIKE :name', { name: `%${name}%` })
          .getCount();
      }

      if (!characters.length) {
        throw new HttpException(
          createResponse(false, 'No characters found', []),
          HttpStatus.NOT_FOUND,
        );
      }

      return createResponse(true, 'Characters found', {
        characters,
        total,
        page,
        limit,
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      console.error('Error retrieving characters:', error.message);
      throw new HttpException(
        createResponse(false, 'Failed to retrieve characters', []),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async refreshCharacters(): Promise<ResponseApiHh<Character[]>> {
    try {
      const characters = await this.importCharacters();

      if (!characters.ok) {
        throw new HttpException(
          createResponse(false, characters.message, []),
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      const newData = await this.characterRepository.manager.transaction(
        async (transactionalEntityManager) => {
          for (const character of characters.data) {
            const existingCharacter = await transactionalEntityManager.findOne(
              Character,
              {
                where: { id: character.id },
              },
            );

            if (existingCharacter) {
              await transactionalEntityManager.update(
                Character,
                character.id,
                character,
              );
            } else {
              await transactionalEntityManager.insert(Character, character);
            }
          }

          return createResponse(
            true,
            'Characters refreshed successfully',
            characters.data,
          );
        },
      );

      return newData;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      console.error('Error refreshing characters:', error.message);
      throw new HttpException(
        createResponse(false, 'Failed to refresh characters', []),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
