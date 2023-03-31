import { Controller, Get, InternalServerErrorException } from '@nestjs/common';
import { GestionPeriodoContableState } from '../states/gestion-periodo-contable/gestion-periodo-contable.state';

@Controller('usuario')
export class UsuarioController {
  constructor(
    private readonly _gestionPeriodoContableState: GestionPeriodoContableState,
  ) {}

  @Get('ejecutar')
  async ejecutar() {
    return await this._gestionPeriodoContableState.iniciar();
  }
}
