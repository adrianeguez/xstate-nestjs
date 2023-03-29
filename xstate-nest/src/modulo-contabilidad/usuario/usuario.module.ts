import { Module } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {UsuarioEntity} from "./usuario.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature(
        [UsuarioEntity], // Entidad en este modulo
        'default'
    ),
  ],
  providers: [UsuarioService],
  exports: [UsuarioService]
})
export class UsuarioModule {}
