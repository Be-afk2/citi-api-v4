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
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { BaseEntity } from 'typeorm/repository/BaseEntity';
import { v4 as uuidv4 } from 'uuid';
import { Region } from './region.entity';
import { User } from './user.entity';
import { Ciudad } from './ciudad.entity';
import { interaccion } from './interaccion.entity';
import { FotosLocal } from './fotoslocal.entity';
import { Etiquetas } from './etiquetas.entiy';
import { LocalTipo } from './localTipo.entity';

@Entity()
export class Local extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  nombre: string;

  @Column({ nullable: false })
  descripcion: string;

  @Column({ nullable: false })
  contacto: string;

  @Column({ nullable: false })
  longitud: string;

  @Column({ nullable: false })
  latitud: string;

  @ManyToOne(() => Ciudad, (Ciudad) => Ciudad.id)
  ciudad: Ciudad;

  @Column({ default: 0 })
  likes: number;

  @Column({ default: 0 })
  compartidos: number;

  @Column({ default: 0 })
  vistos: number;

  @Column({ default: 0 })
  reportes: number;

  @Column({ default: 0 })
  tipo: number;

  @ManyToOne(() => LocalTipo, (LocalTipo) => LocalTipo.id, { nullable: true })
  LocalTipo: LocalTipo;

  @OneToMany(() => User, (user) => user.id, { nullable: true })
  user: User[];

  @OneToMany(() => interaccion, (interaccion) => interaccion.local)
  interaccion: interaccion[];

  @OneToMany(() => FotosLocal, (FotosLocal) => FotosLocal.local)
  fotos: FotosLocal[];

  @ManyToMany(() => Etiquetas)
  @JoinTable()
  etiquetas: Etiquetas[];

  // @ManyToOne(() => Local, {nullable :true})
  // @JoinColumn()
  // local: Local

  @Column({ default: true })
  Habilitar: boolean;

  @Column({ default: false })
  necro: boolean;

  @DeleteDateColumn()
  deleted_at: Date;
  @CreateDateColumn()
  created_at: Date;
  @UpdateDateColumn()
  updated_at: Date;
}
