
import { Entity, Column, PrimaryGeneratedColumn,CreateDateColumn,UpdateDateColumn,DeleteDateColumn, Timestamp, Table, OneToMany, ManyToOne} from 'typeorm';
import { BaseEntity } from 'typeorm/repository/BaseEntity';
import { v4 as uuidv4 } from 'uuid';
import { Region } from './region.entity';
import { User } from './user.entity';
import { Local } from './local.entity';
import { Evento } from './evento.entity';



@Entity()
export class TipoUser extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable:false})
    tipo:string;

    @OneToMany(() => User, user => user.tipoUser)
    User: User



    @DeleteDateColumn()
    deleted_at:Date;
    @CreateDateColumn()
    created_at:Date;
    @UpdateDateColumn()
    updated_at:Date;

}