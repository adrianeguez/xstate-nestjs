import {
  Controller,
  Get,
  InternalServerErrorException,
  Query,
} from '@nestjs/common';
import { GestionPeriodoContableState } from '../states/gestion-periodo-contable/gestion-periodo-contable.state';

@Controller('usuario')
export class UsuarioController {
  constructor(
    private readonly _gestionPeriodoContableState: GestionPeriodoContableState,
  ) {}

  @Get('ejecutar')
  async ejecutar(
    @Query('anio') anio: string,
    @Query('periodoContableId') periodoContableId: string,
  ) {
    const parametros: { periodoContableId: number; anio: number } = {
      anio: +(anio || 2022),
      periodoContableId: +(periodoContableId || 1),
    };
    return await this._gestionPeriodoContableState.iniciar(parametros);
  }
}
