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
import { User } from './user.entity';

@Entity()
export class TipoUser extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  tipo: string;

  @OneToMany((type) => User, (user) => user.tipoUser)
  users: User[];

  @DeleteDateColumn()
  deleted_at: Date;
  @CreateDateColumn()
  created_at: Date;
  @UpdateDateColumn()
  updated_at: Date;
}
