/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { PaguinadorDto } from './dto/paguinadorDto.dto';

@Injectable()
export class EtiquetaService {



    async GetEtiquetas(data: PaguinadorDto) {
        return data;

    }

}
