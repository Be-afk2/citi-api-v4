
import { Entity, Column, PrimaryGeneratedColumn,CreateDateColumn,UpdateDateColumn,DeleteDateColumn, Timestamp, Table, OneToMany, ManyToOne} from 'typeorm';
import { BaseEntity } from 'typeorm/repository/BaseEntity';
import { v4 as uuidv4 } from 'uuid';
import { Region } from './region.entity';
import { User } from './user.entity';
import { Ciudad } from './ciudad.entity';
import { Interacion } from './interacion.entity';
import { FotosLocal } from './fotoslocal.entity';



@Entity()
export class Local extends BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({nullable:false})
    nombre:string;

    @Column({nullable:false})
    descripcion:string;

    @Column({nullable:false})
    contacto:string;

    @Column({nullable:false})
    longitud:string;

    @Column({nullable:false})
    latitud:string;

    @ManyToOne(() => Ciudad, Ciudad => Ciudad.id)
    ciudad: Ciudad

    @Column({default:0})
    likes:string;

    @Column({default:0})
    compartidos:string;

    @Column({default:0})
    vistos:string;

    @Column({default:0})
    tipo:string;
 
    @OneToMany(() => User, user => user.id, { nullable: true })
    user: User[];
    
    @OneToMany(() => Interacion, Interacion => Interacion.id)
    interacion: Interacion[];

    @OneToMany(() => FotosLocal, FotosLocal => FotosLocal.local)
    fotos: FotosLocal[];

    // @ManyToOne(() => Local, {nullable :true})
    // @JoinColumn()
    // local: Local



    @DeleteDateColumn()
    deleted_at:Date;
    @CreateDateColumn()
    created_at:Date;
    @UpdateDateColumn()
    updated_at:Date;

}