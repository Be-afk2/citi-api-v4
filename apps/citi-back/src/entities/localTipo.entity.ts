import {
  Entity,
  BaseEntity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { Local } from './local.entity';

@Entity()
export class LocalTipo extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tipo: string;

  @OneToMany(() => Local, (Local) => Local.tipo)
  local: Local[];
}
