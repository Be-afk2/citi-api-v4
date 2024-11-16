
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, Timestamp, Table, OneToMany, ManyToOne } from 'typeorm';
import { BaseEntity } from 'typeorm/repository/BaseEntity';
import { v4 as uuidv4 } from 'uuid';
import { Pais } from './pais.entity';
import { Ciudad } from './ciudad.entity';



@Entity()
export class Region extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    nombre: string;



    @OneToMany(type => Ciudad, Ciudad => Ciudad.region)
    Ciudad: Ciudad[];

    @ManyToOne(type => Pais, Pais => Pais.id)
    Pais: Pais;

    @DeleteDateColumn()
    deleted_at: Date;
    @CreateDateColumn()
    created_at: Date;
    @UpdateDateColumn()
    updated_at: Date;

}