export interface EjemploRetryContexto {
    delay: number;
    numeroRetries: number;
    error?: any;
    parametroNumero: number;
    numeroEsMayorADiezYEsPar: boolean;
    revisionNumeroCompletado?: boolean;
}