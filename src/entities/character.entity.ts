import { Gender } from 'src/utils/enums/gender.enum';
import { Status } from 'src/utils/enums/status.enum';
import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

@Entity()
@Index('idx_characters_name', ['name'])
export class Character {
  @PrimaryColumn()
  id: number;

  @Column({
    length: 100,
    comment: 'The name of the character as it appears in the show',
  })
  name: string;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.UNKNOWN,
    comment: 'The status of the character',
  })
  status: Status;

  @Column({ length: 50, comment: 'The species of the character' })
  species: string;

  @Column({
    length: 50,
    nullable: true,
    default: '',
    comment: 'The type or subspecies of the character',
  })
  type?: string;

  @Column({
    type: 'enum',
    enum: Gender,
    default: Gender.UNKNOWN,
    comment: 'The gender of the character',
  })
  gender: Gender;

  @Column({ type: 'text', comment: "URL of the character's image" })
  image: string;
}
