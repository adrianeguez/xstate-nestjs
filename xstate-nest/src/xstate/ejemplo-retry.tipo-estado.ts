import {EjemploRetryContexto} from "./ejemplo-retry.contexto";

export type EjemploRetryTipoEstado =
    | {
    value: 'porEmpezar';
    context: EjemploRetryContexto & {
        error: undefined;
        numeroEsMayorADiezYEsPar: false;
    };
} | {
    value: 'promesaRevisionNumero';
    context: EjemploRetryContexto
} | {
    value: 'revisarRespuestaPromesaRevision';
    context: EjemploRetryContexto
} | {
    value: 'retryPromesaRevisionNumero';
    context: EjemploRetryContexto
} | {
    value: 'resueltoCorrectamente';
    context: EjemploRetryContexto
} | {
    value: 'resueltoConErrorDeNumeroDeRetriesMaximo';
    context: EjemploRetryContexto
}