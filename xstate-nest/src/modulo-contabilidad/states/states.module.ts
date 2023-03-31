import { Module } from '@nestjs/common';
import { GestionPeriodoContableState } from './gestion-periodo-contable/gestion-periodo-contable.state';

@Module({
  imports: [],
  providers: [GestionPeriodoContableState],
  exports: [GestionPeriodoContableState],
})
export class StatesModule {}
