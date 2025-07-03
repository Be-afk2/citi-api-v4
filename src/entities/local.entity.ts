import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { BaseEntity } from 'typeorm/repository/BaseEntity';
import { User } from './user.entity';
import { Ciudad } from './ciudad.entity';
import { Interacion } from './interacion.entity';
import { FotosLocal } from './fotoslocal.entity';
import { Etiquetas } from './etiquetas.entiy';

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
  likes: string;

  @Column({ default: 0 })
  compartidos: string;

  @Column({ default: 0 })
  vistos: string;

  @Column({ default: 0 })
  reportes: string;

  @Column({ default: 0 })
  tipo: string;

  @OneToMany(() => User, (user) => user.id, { nullable: true })
  user: User[];

  @OneToMany(() => Interacion, (Interacion) => Interacion.local)
  interacion: Interacion[];

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
