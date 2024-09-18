import { Module } from '@nestjs/common';
import { CharactersService } from './services/characters.service';
import { CharactersController } from './controllers/characters.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Character } from 'src/entities/character.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Character])],
  controllers: [CharactersController],
  providers: [CharactersService],
  exports: [CharactersService, TypeOrmModule],
})
export class CharactersModule {}
