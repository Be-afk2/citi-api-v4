/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller, Get } from '@nestjs/common';
import { InvitadoService } from './invitado.service';

@Controller("invitado")
export class InvitadoController {
    constructor(
        private readonly InvitadoService: InvitadoService
    ) { }




    @Get("")
    async GetInvitado() {
        return await this.InvitadoService.GetInvitado()
    }
}
