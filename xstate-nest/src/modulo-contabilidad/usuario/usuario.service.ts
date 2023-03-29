import { Injectable } from '@nestjs/common';
import {InjectDataSource} from "@nestjs/typeorm";
import {UsuarioEntity} from "./usuario.entity";
import {DataSource} from "typeorm";

@Injectable()
export class UsuarioService{
    constructor(
        @InjectDataSource()
        public datasource: DataSource
    ) {
this.crearTransaccion().then().catch()
    }

    async crearTransaccion(){
        await this.datasource.manager.transaction(async (transactionalEntityManager) => {
            const usuario: UsuarioEntity = transactionalEntityManager.getRepository(UsuarioEntity).create()
            usuario.firstName = 'fasdf ' + Date.now() ;
            await transactionalEntityManager.getRepository(UsuarioEntity).save(usuario)
            // ...
        })
    }

    public usuarioRepository = this.datasource.getRepository(UsuarioEntity);


    getUser(){
        return this.usuarioRepository.find();
    }


}
