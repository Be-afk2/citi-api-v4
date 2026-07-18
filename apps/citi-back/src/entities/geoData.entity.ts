import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Table,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { BaseEntity } from 'typeorm/repository/BaseEntity';
import { v4 as uuidv4 } from 'uuid';
import { Region } from './region.entity';
import { User } from './user.entity';
import { Local } from './local.entity';
import { Evento } from './evento.entity';
import { Ciudad } from './ciudad.entity';

@Entity()
export class GeoData extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  longitud: string;

  @Column({ nullable: false })
  latitud: string;

  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @ManyToOne(() => Ciudad, (Ciudad) => Ciudad.id)
  ciudad: Ciudad;

  @DeleteDateColumn()
  deleted_at: Date;
  @CreateDateColumn()
  created_at: Date;
  @UpdateDateColumn()
  updated_at: Date;
}
