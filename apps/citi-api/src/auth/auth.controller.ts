/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Get, Post, UseGuards,Request } from '@nestjs/common';
import { CreateUserDto } from './dto/CreateUser.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/LoginDto.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

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


    @Get("login")
    @UseGuards(JwtAuthGuard)
    async logintoken(@Request() req){
        return req.user

    }
    

}
