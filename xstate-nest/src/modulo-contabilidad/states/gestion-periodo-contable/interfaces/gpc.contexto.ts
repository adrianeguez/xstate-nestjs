import { ContextoAbstract } from '../../../../abstract/contextoAbstract';

export interface GpcContexto<RespuestaEstado = any>
  extends ContextoAbstract<RespuestaEstado> {
  anio: number;
  periodoContableId: number;
  periodoContable?: any; // tipar con la entidad.
  cuentasContables?: any[]; // tipar con la entidad.
}
