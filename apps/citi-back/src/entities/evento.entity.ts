
import { Entity, Column, PrimaryGeneratedColumn,CreateDateColumn,UpdateDateColumn,DeleteDateColumn, Timestamp, Table, OneToMany, ManyToOne} from 'typeorm';
import { BaseEntity } from 'typeorm/repository/BaseEntity';
import { v4 as uuidv4 } from 'uuid';
import { Region } from './region.entity';
import { User } from './user.entity';
import { Local } from './local.entity';
import { Ciudad } from './ciudad.entity';
import { FotosEvento } from './fotosEvento.entity';



@Entity()
export class Evento extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable:false})
    nombre:string;

    @Column()
    descripcion:string;

    @Column()
    longitud:string;

    @Column()
    latitud:string;

    @Column()
    Organizador:string;

    @ManyToOne(() => Ciudad, Ciudad => Ciudad.id)
    ciudad: Ciudad

    @Column({default:0})
    likes:string;

    @Column({default:0})
    compartidos:string;

    @Column({default:0})
    vistos:string;

    @Column({default:0})
    reportes:string;

    @OneToMany(() => FotosEvento, FotosEvento => FotosEvento.evento)
    fotos: FotosEvento[];

    @DeleteDateColumn()
    deleted_at:Date;
    @CreateDateColumn()
    created_at:Date;
    @UpdateDateColumn()
    updated_at:Date;

}