import { EjemploRetryContexto } from '../../../../xstate/ejemplo-retry.contexto';
import { GpcContexto } from './gpc.contexto';

export type GpcTipoEstado =
  | {
      value: 'porEmpezar';
      context: GpcContexto;
    }
  | {
      value: 'validarAnioRepetido';
      context: GpcContexto;
    }
  | {
      value: 'errorAnioRepetido';
      context: GpcContexto;
    }
  | {
      value: 'validarPeriodoContableEnBDD';
      context: GpcContexto;
    }
  | {
      value: 'ValidarPeriodoContableExisteYEstaActivo';
      context: GpcContexto;
    }
  | {
      value: 'CrearPeriodoContableYCuentasContableEnCero';
      context: GpcContexto;
    }
  | {
      value: 'DeshabilitarPeriodoContableAnteriorYActivarNuevoPeriodoContable';
      context: GpcContexto;
    }
  | {
      value: 'ErrorNoExisteOperiodoDiferenteActivo';
      context: GpcContexto;
    }
  | {
      value: 'CrearPeriodoContableConValoresSaldosCreditos';
      context: GpcContexto;
    }
  | {
      value: 'CrearCuentasContablesConAnioReferencia';
      context: GpcContexto;
    }
  | {
      value: 'CreadoCorrectamente';
      context: GpcContexto;
    };
