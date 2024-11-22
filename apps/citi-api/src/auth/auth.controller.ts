/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/CreateUser.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/LoginDto.dto';

@Controller("auth")
export class AuthController {

    constructor(
        private AuthService: AuthService
    ) { }


    @Post()
    async CreateLogin(@Body() data: CreateUserDto) 
    {
        return await this.AuthService.createUser(data);
    }

    @Post("login")
    async Login(@Body() data: LoginDto) 
    {
        return await this.AuthService.login(data) 
    }

}
