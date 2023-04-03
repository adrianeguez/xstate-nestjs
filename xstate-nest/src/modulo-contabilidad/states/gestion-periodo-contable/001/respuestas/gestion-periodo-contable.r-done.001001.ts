import { EventObject } from 'xstate/lib/types';

export type GestionPeriodoContableRDone001001 = EventObject & {
  data: TGestionPeriodoContableRDone001001;
};
export type TGestionPeriodoContableRDone001001 = {
  periodoContable: any; // tipar con la entidad correspondiente
  cuentasContables: any[];
};
