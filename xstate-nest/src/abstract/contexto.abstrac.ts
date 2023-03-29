import {EntityManager} from "typeorm";

export interface ContextoAbstrac {
    delay: number;
    numeroRetries: number;
    error?: number;
    mensajeError?: string;
    entityManager: EntityManager
}