import { Module } from '@nestjs/common';
import { GestionPeriodoContableState025026 } from './gestion-periodo-contable/gestion-periodo-contable.state.025026';

@Module({
  imports: [],
  providers: [GestionPeriodoContableState025026],
  exports: [GestionPeriodoContableState025026],
})
export class StatesModule {}
