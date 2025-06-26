/*
https://docs.nestjs.com/providers#services
*/



// revisar los codigos postales  para analizar las ciudades / pueblos / etc vecinas



import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { Pais } from 'apps/citi-back/src/entities/pais.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ciudad } from 'apps/citi-back/src/entities/ciudad.entity';
import { Region } from 'apps/citi-back/src/entities/region.entity';
import { GeoDataDto } from './dto/geoData.dto';
import { User } from 'apps/citi-back/src/entities/user.entity';
import { GeoData } from 'apps/citi-back/src/entities/geoData.entity';
import { GetOneDto } from '../local/dto/GetOneDto.dto';

@Injectable()
export class GeoService {
    constructor(
        @InjectRepository(Pais)
        private PaisRepository: Repository<Pais>,

        @InjectRepository(Ciudad)
        private CiudadRepository: Repository<Ciudad>,

        @InjectRepository(Region)
        private RegionRepository: Repository<Region>,

        @InjectRepository(GeoData)
        private GeoDataRepository: Repository<GeoData>,

        @InjectRepository(User)
        private UserRepository: Repository<User>,

    ) { }


    // peticion a la api para obtener la geolocalizacion del lugar
    async GetGeoData(data: GeoDataDto) {
        const OPEN_CAGE_API_KEY = process.env.GEOKEY
        const url = `https://api.opencagedata.com/geocode/v1/json?key=${OPEN_CAGE_API_KEY}&q=${data.Latitud}+${data.Longitud}&pretty=1&no_annotations=1`;
        const response = await axios.get(url);
        return {
            comuna: response.data.results[0].components.town,
            ciudad: response.data.results[0].components.city ? response.data.results[0].components.city : response.data.results[0].components.village ? response.data.results[0].components.village : response.data.results[0].components.town,
            Region: response.data.results[0].components.state,
            Direcion: response.data.results[0].formatted,
            pais: response.data.results[0].components.country,
            components: response.data.results[0].components,
            codigoPostal: response.data.results[0].components.postcode
        }

    }

    // test
    async asd(data: GeoDataDto) {
        const OPEN_CAGE_API_KEY = process.env.GEOKEY
        const url = `https://api.opencagedata.com/geocode/v1/json?key=${OPEN_CAGE_API_KEY}&q=${data.Latitud}+${data.Longitud}&pretty=1&no_annotations=1`;
        const response = await axios.get(url);
        return response.data
    }

    // peticion para crear los diferentes elementos como ciudad , region , pais
    async GetData(data: GeoDataDto) {
        const geodata = await this.GetGeoData(data);
        const pais = await this.crearPais(geodata.pais);
        const region = await this.crearRegion(geodata.Region, pais);
        const ciudad = await this.crearCiudad(geodata.ciudad, region, geodata.codigoPostal);


        return {
            pais: pais,
            region: region,
            ciudad: ciudad
        }
    }


    async crearRegion(RegionName: string, pais: Pais) {

        var Region = await this.RegionRepository.findOneBy({ nombre: RegionName, Pais: { id: pais.id } });
        if (Region) {
            return Region;
        }
        Region = await this.RegionRepository.create();
        Region.nombre = RegionName;
        Region.Pais = pais;
        await Region.save();
        return await Region
    }

    async crearPais(PaisName: string) {

        var Pais = await this.PaisRepository.findOneBy({ nombre: PaisName });

        if (Pais) {
            return Pais;
        }

        Pais = await this.PaisRepository.create();
        Pais.nombre = PaisName;
        await Pais.save();
        return await Pais
    }

    async crearCiudad(CiudadName: string, Region: Region, PostalCode: string) {

        var Ciudad = await this.CiudadRepository.findOneBy({ nombre: CiudadName, region: { id: Region.id } });
        if (Ciudad) {
            return Ciudad;
        }

        Ciudad = await this.CiudadRepository.create();
        Ciudad.nombre = CiudadName;
        Ciudad.region = Region;

        if (PostalCode) {

            Ciudad.CodigoPostal = parseInt(PostalCode.split(' ')[0] + '0'.repeat(PostalCode.split(' ')[0].length));
        }

        await Ciudad.save();
        return await Ciudad
    }



    async SaveDataUser(data: GeoDataDto, user: User) {


        const geodata = await this.GetData(data);
        user.ciudad = geodata.ciudad;
        await user.save()
        await this.SaveGeoData(data, user)
        return geodata.ciudad
    }


    async SaveGeoData(data: GeoDataDto, User: User) {
        const Geodata = await this.GeoDataRepository.create();
        Geodata.longitud = data.Longitud;
        Geodata.latitud = data.Latitud;
        Geodata.user = User
        await Geodata.save();
    }

    async GetUserDataGeo(userId: GetOneDto) {
        const user = await this.UserRepository.findOneBy({ id: userId.id });
        const data = await this.GeoDataRepository
        .createQueryBuilder("GeoData")
        .where("user.id = :id", { id: user.id })
        .getRawMany();

        return data
    }
}
