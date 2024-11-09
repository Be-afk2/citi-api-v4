
import { Entity, Column, PrimaryGeneratedColumn,CreateDateColumn,UpdateDateColumn,DeleteDateColumn, Timestamp, Table, OneToMany, ManyToOne} from 'typeorm';
import { BaseEntity } from 'typeorm/repository/BaseEntity';
import { v4 as uuidv4 } from 'uuid';
import { Pais } from './pais.entity';
import { Ciudad } from './ciudad.entity';
import { User } from './user.entity';
import { Local } from './local.entity';



@Entity()
export class Interacion extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({default:false})
    like :boolean;

    @Column({default:false})
    compartido :boolean;

    @Column({default:false})
    visto :boolean;


    @ManyToOne(() => User, user => user.id)
    user: User


    @ManyToOne(() => Local, Local => Local.id)
    local: Local

    @DeleteDateColumn()
    deleted_at:Date;
    @CreateDateColumn()
    created_at:Date;
    @UpdateDateColumn()
    updated_at:Date;

}