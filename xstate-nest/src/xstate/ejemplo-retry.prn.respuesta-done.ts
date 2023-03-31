import { EventObject } from 'xstate/lib/types';

export type EjemploRetryPrnRespuestaDone = EventObject & {
  data: EjemploRetryPrnRespuesta;
};
export type EjemploRetryPrnRespuesta = {
  numeroEsMayorADiezYEsPar: boolean;
  revisionNumeroCompletado: boolean;
};
