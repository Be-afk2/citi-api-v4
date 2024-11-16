
import { Entity, Column, PrimaryGeneratedColumn,CreateDateColumn,UpdateDateColumn,DeleteDateColumn, Timestamp, Table, OneToMany, ManyToOne} from 'typeorm';
import { BaseEntity } from 'typeorm/repository/BaseEntity';

import { Local } from './local.entity';
import { Etiquetas } from './etiquetas.entiy';
import { Evento } from './evento.entity';



@Entity()
export class EtiquetasEvento extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;


    @ManyToOne(type => Evento, Evento => Evento.id)
    evento:Evento

    @OneToMany(() => Etiquetas, Etiquetas => Etiquetas.id)
    Etiquetas: Etiquetas[];

    // @OneToMany(() => Local, Local => Local.ciudad)
    // local: Local[];


    @DeleteDateColumn()
    deleted_at:Date;
    @CreateDateColumn()
    created_at:Date;
    @UpdateDateColumn()
    updated_at:Date;

}