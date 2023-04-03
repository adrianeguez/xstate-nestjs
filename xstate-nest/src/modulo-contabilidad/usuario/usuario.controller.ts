import {
  Controller,
  Get,
  InternalServerErrorException,
  Query,
} from '@nestjs/common';
import { GestionPeriodoContableState025026 } from '../states/gestion-periodo-contable/gestion-periodo-contable.state.025026';

@Controller('usuario')
export class UsuarioController {
  constructor(
    private readonly _gestionPeriodoContableState: GestionPeriodoContableState025026,
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
    return await this._gestionPeriodoContableState.iniciar025026001(parametros);
  }
}
