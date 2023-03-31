import { EventObject } from 'xstate/lib/types';

export type ResGpcA001Done = EventObject & {
  data: ResGpcA001;
};
export type ResGpcA001 = {
  periodoContable: any; // tipar con la entidad correspondiente
  cuentasContables: any[];
};
