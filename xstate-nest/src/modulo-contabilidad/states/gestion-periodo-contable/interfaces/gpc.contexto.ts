import {ContextoAbstrac} from "../../../../abstract/contexto.abstrac";

export interface GpcContexto extends ContextoAbstrac{

    anio: number;
    periodoContableId: number;
    periodoContable?: any; // tipar con la entidad.
    cuentasContables?: any[]; // tipar con la entidad.
}