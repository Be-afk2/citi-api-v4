/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller, Post } from '@nestjs/common';
import { LocalService } from './local.service';
import { CreateLocalDto } from './dto/CreateLocal.dto';

@Controller()
export class LocalController {

    constructor(
        private readonly localService: LocalService
    ) {}

    @Post()
    async CreateLocal(data: CreateLocalDto) {
        return this.localService.CreateLocal(data);

    }

}
