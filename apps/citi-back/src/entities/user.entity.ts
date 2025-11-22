import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Timestamp,
  Table,
  OneToMany,
  ManyToOne,
  JoinColumn,
  OneToOne,
  JoinTable,
  ManyToMany,
} from 'typeorm';
import { BaseEntity } from 'typeorm/repository/BaseEntity';
import { v4 as uuidv4 } from 'uuid';

import { interaccion } from './interaccion.entity';
import { Ciudad } from './ciudad.entity';
import { Local } from './local.entity';
import { TipoUser } from './TipoUser.entity';
import { Etiquetas } from './etiquetas.entiy';
import { Exclude } from 'class-transformer';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  nombre: string;

  @Column({ nullable: true })
  apellido: string;

  @Column({ nullable: true })
  apodo: string;

  @Column({ nullable: false, unique: true })
  correo: string;

  @Exclude({ toPlainOnly: true })
  @Column({ nullable: false })
  password: string;

  @Column({ default: false })
  validMail: boolean;

  @Column({ nullable: true })
  fechaNacimiento: Date;

  @Column({ default: false })
  mayorEdad: boolean;

  @Column({ default: false })
  mostrarContenidoMayor: boolean;

  @ManyToOne(() => Ciudad, (Ciudad) => Ciudad.id)
  ciudad: Ciudad;

  @ManyToOne(() => TipoUser, (tipoUser) => tipoUser.id)
  tipoUser: TipoUser;

  @ManyToOne(() => Local, { nullable: true })
  @JoinColumn()
  local: Local;

  @OneToMany(() => interaccion, (interaccion) => interaccion.user)
  interaccion: interaccion[];

  @ManyToMany(() => Etiquetas)
  @JoinTable()
  Preferencias: Etiquetas[];

  @ManyToMany(() => Local)
  @JoinTable()
  Favoritos: Local[];

  @DeleteDateColumn()
  deleted_at: Date;
  @CreateDateColumn()
  created_at: Date;
  @UpdateDateColumn()
  updated_at: Date;
}
