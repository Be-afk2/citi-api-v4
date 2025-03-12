
import { Entity, Column, PrimaryGeneratedColumn,CreateDateColumn,UpdateDateColumn,DeleteDateColumn, Timestamp, Table, OneToMany, ManyToOne} from 'typeorm';
import { BaseEntity } from 'typeorm/repository/BaseEntity';
import { v4 as uuidv4 } from 'uuid';
import { Region } from './region.entity';
import { User } from './user.entity';
import { Local } from './local.entity';
import { Evento } from './evento.entity';



@Entity()
export class Ciudad extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable:false})
    nombre:string;

    @ManyToOne(type => Region, Region => Region.id)
    region:Region

    @OneToMany(() => User, user => user.ciudad)
    user: User[];

    @OneToMany(() => Local, Local => Local.ciudad)
    local: Local[];
    
    @OneToMany(() => Evento, Evento => Evento.ciudad)
    evento: Local[];

    @Column({nullable:true})
    CodigoPostal:number;

    @DeleteDateColumn()
    deleted_at:Date;
    @CreateDateColumn()
    created_at:Date;
    @UpdateDateColumn()
    updated_at:Date;

}