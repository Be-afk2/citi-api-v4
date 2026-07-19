import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
} from 'typeorm';
import { BaseEntity } from 'typeorm/repository/BaseEntity';
import { User } from './user.entity';
import { Local } from './local.entity';
import { Evento } from './evento.entity';

@Entity()
export class interaccion extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: false })
  like: boolean;

  @Column({ default: false })
  compartido: boolean;

  @Column({ default: false })
  visto: boolean;

  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @ManyToOne(() => Local, (Local) => Local.id)
  local: Local;

  @ManyToOne(() => Evento, (Evento) => Evento.id)
  evento: Evento;

  @DeleteDateColumn()
  deleted_at: Date;
  @CreateDateColumn()
  created_at: Date;
  @UpdateDateColumn()
  updated_at: Date;
}
