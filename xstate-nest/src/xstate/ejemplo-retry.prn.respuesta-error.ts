import {EventObject} from "xstate/lib/types";

export type EjemploRetryPrnRespuestaError = EventObject & {
    data: EjemploRetryPrnError
}
export type EjemploRetryPrnError = {
    error: number;
    mensaje: string;
    numeroRetries: number;
}