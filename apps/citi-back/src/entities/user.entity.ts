
import { Entity, Column, PrimaryGeneratedColumn,CreateDateColumn,UpdateDateColumn,DeleteDateColumn, Timestamp, Table, OneToMany, ManyToOne, JoinColumn, OneToOne} from 'typeorm';
import { BaseEntity } from 'typeorm/repository/BaseEntity';
import { v4 as uuidv4 } from 'uuid';
import { Ciudad } from '../ciudad/ciudad.entity';
import { Tipo_User } from '../tipo_users/tipo_user.entity';
import { Local } from '../Local/Local.entity';
import { Interacion } from '../Interaciones/Interacion.entity';


@Entity()
export class User extends BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @Column({nullable:false})
    nombre:string;

    @Column({nullable:true})
    apellido:string;

    @Column({nullable:true})
    apodo:string;

    @Column({nullable:false, unique: true})
    correo:string;

    @Column({nullable:false})
    password:string;

    @Column({default :false})
    valid_mail :boolean
    

    @Column({nullable :false})
    fecha_nacimiento :Date

    @Column({nullable :false})
    mayor_edad :boolean

    @Column({nullable :false})
    mostrar_contenido_18 :boolean

    
    @ManyToOne(() => Ciudad, Ciudad => Ciudad.id)
    Ciudad: Ciudad

    @ManyToOne(() => Tipo_User, Tipo_User => Tipo_User.id)
    Tipo_User: Tipo_User

    @OneToOne(() => Local)
    @JoinColumn()
    Local: Local

    @OneToMany(() => Interacion, Interacion => Interacion.User)
    Interacion: Interacion[];
    
    @DeleteDateColumn()
    deleted_at:Date;
    @CreateDateColumn()
    created_at:Date;
    @UpdateDateColumn()
    updated_at:Date;

}