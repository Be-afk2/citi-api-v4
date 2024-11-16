/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'apps/citi-back/src/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/CreateUser.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private UsersRepository: Repository<User>,



        private jwtService: JwtService,
    ) { }

    
    async createUser(data: CreateUserDto) {
        return data
    }

    async findUserById(id, bool) {

        const user = await this.UsersRepository.findOne({
            where: { id: id },
            relations: ['TipoUser'] // Aquí se especifica la relación
        });
        return user
    }
}
