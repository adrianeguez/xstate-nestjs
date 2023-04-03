import { GestionPeriodoContableContexto001 } from './gestion-periodo-contable.contexto.001';

export type GestionPeriodoContableTipoEstado001 =
  | {
      value: 'porEmpezar';
      context: GestionPeriodoContableContexto001;
    }
  | {
      value: 'validarAnioRepetido';
      context: GestionPeriodoContableContexto001;
    }
  | {
      value: 'errorAnioRepetido';
      context: GestionPeriodoContableContexto001;
    }
  | {
      value: 'validarPeriodoContableEnBDD';
      context: GestionPeriodoContableContexto001;
    }
  | {
      value: 'ValidarPeriodoContableExisteYEstaActivo';
      context: GestionPeriodoContableContexto001;
    }
  | {
      value: 'CrearPeriodoContableYCuentasContableEnCero';
      context: GestionPeriodoContableContexto001;
    }
  | {
      value: 'DeshabilitarPeriodoContableAnteriorYActivarNuevoPeriodoContable';
      context: GestionPeriodoContableContexto001;
    }
  | {
      value: 'ErrorNoExisteOperiodoDiferenteActivo';
      context: GestionPeriodoContableContexto001;
    }
  | {
      value: 'CrearPeriodoContableConValoresSaldosCreditos';
      context: GestionPeriodoContableContexto001;
    }
  | {
      value: 'CrearCuentasContablesConAnioReferencia';
      context: GestionPeriodoContableContexto001;
    }
  | {
      value: 'CreadoCorrectamente';
      context: GestionPeriodoContableContexto001;
    };
