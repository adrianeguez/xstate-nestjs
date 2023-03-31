import { EventObject } from 'xstate/lib/types';

export type ResErrorAbstract = EventObject & {
  data: IResErrorAbstract;
};
export interface IResErrorAbstract {
  error: number;
  mensajeError: string;
}
