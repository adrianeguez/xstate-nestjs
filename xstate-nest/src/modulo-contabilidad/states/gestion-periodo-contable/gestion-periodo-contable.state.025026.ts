import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntityManager } from 'typeorm';
import { assign, createMachine } from 'xstate';
import { GestionPeriodoContableContexto001 } from './001/interfaces/gestion-periodo-contable.contexto.001';
import { GestionPeriodoContableEventos001 } from './001/interfaces/gestion-periodo-contable.eventos.001';
import { GestionPeriodoContableTipoEstado001 } from './001/interfaces/gestion-periodo-contable.tipo-estado.001';
import { UsuarioEntity } from '../../usuario/usuario.entity';
import { ResErrorAbstract } from '../../../abstract/res-error.abstract';
import {
  GestionPeriodoContableREstado001001,
  TGestionPeriodoContableREstado001001,
} from './001/respuestas/gestion-periodo-contable.r-estado.001001';
import { RespuestaEstado } from '../../../abstract/interfaces/respuesta-estado';
import { AbstractServicioState } from '../../../abstract/abstract.servicio.state';
import { GestionPeriodoContableParametros001 } from './001/interfaces/gestion-periodo-contable.parametros.001';
import {
  GestionPeriodoContableRDone001002,
  TGestionPeriodoContableRDone001002,
} from './001/respuestas/gestion-periodo-contable.r-done.001002';
import {
  GestionPeriodoContableRDone001001,
  TGestionPeriodoContableRDone001001,
} from './001/respuestas/gestion-periodo-contable.r-done.001001';
import {
  GestionPeriodoContableRDone001003,
  TGestionPeriodoContableRDone001003,
} from './001/respuestas/gestion-periodo-contable.r-done.001003';

@Injectable()
export class GestionPeriodoContableState025026 extends AbstractServicioState {
  constructor(
    @InjectDataSource()
    public datasource: DataSource,
  ) {
    super(datasource);
  }
  async iniciar025026001(
    parametros: GestionPeriodoContableParametros001,
  ): Promise<RespuestaEstado<GestionPeriodoContableREstado001001>> {
    return this.configurarEIniciarFlujo<
      GestionPeriodoContableContexto001,
      GestionPeriodoContableREstado001001
    >({
      generarInstancia: this.instanciaGestionPeriodoContableState025026001,
      contextoInicial: {
        anio: parametros.anio,
        periodoContableId: parametros.periodoContableId,
        delay: this.tiempoDelay,
        numeroRetries: this.numeroRetries,
      },
    });
  }

  instanciaGestionPeriodoContableState025026001 = (
    contexto: GestionPeriodoContableContexto001<GestionPeriodoContableREstado001001>,
    entityManager: EntityManager,
  ) => {
    try {
      return createMachine<
        GestionPeriodoContableContexto001,
        GestionPeriodoContableEventos001,
        GestionPeriodoContableTipoEstado001
      >({
        predictableActionArguments: true,
        id: 'modulo-contabilidad-025/026/001',
        initial: 'porEmpezar',
        context: contexto,
        states: {
          porEmpezar: {
            on: {
              EMPEZAR: 'validarAnioRepetido',
            },
          },
          validarAnioRepetido: {
            invoke: {
              id: 'validarAnioRepetido',
              src: (context, event) => {
                console.log({
                  message: `tiene un delay de: ${context.delay}`,
                  context,
                  event: event.type,
                });
                return new Promise<void>(async (res, rej) => {
                  try {
                    // throw new Error('Error'); // Ejemplo de error, descomentae para ver flujo correcto
                    await entityManager.getRepository(UsuarioEntity).find();
                    console.log(
                      `Validando anio repetido con ID periodo contable ${context.periodoContableId} y anio ${context.anio}`,
                    );
                    res(); // OnDone
                  } catch (error) {
                    rej({
                      error: 400,
                      mensajeError:
                        'Error Validando anio repetido con ID periodo contable',
                    });
                  }
                  // rej({error: 500, mensajeError: 'Fallo'});// OnError
                });
              },
              onDone: {
                target: 'validarPeriodoContableEnBDD',
                // Ejemplo sin respuesta:
                // actions: assign<GestionPeriodoContableContexto001>({
                // Ejemplo con respuesta:
                // actions: assign<GestionPeriodoContableContexto001, GestionPeriodoContableRDone001001>({
                actions: assign<GestionPeriodoContableContexto001>({
                  // Ejemplo asignando flujo corto:
                  // ejemploPropiedadEnContextoAGuardarCorta: (context, event) => event.data.ejemploPropiedadEnContextoAGuardarCorta,
                  // Ejemplo asignando flujo largo:
                  // ejemploPropiedadEnContextoAGuardar: (context, event) => {
                  // Se puede enviar mensajes extra del Logger aquí si es necesario u otro procesamiento
                  // return event.data.ejemploPropiedadEnContextoAGuardar;
                  // }
                }),
              },
              onError: {
                target: 'errorAnioRepetido',
                actions: assign<
                  GestionPeriodoContableContexto001,
                  ResErrorAbstract
                >({
                  error: (context, event) => event.data.error,
                  mensajeError: (context, event) => event.data.mensajeError,
                }),
              },
            },
          },
          errorAnioRepetido: {
            type: 'final',
            data: {
              error: 500,
            },
          },
          validarPeriodoContableEnBDD: {
            invoke: {
              id: 'validarPeriodoContableEnBDD', //Promesa Revision Numero
              src: (context, event) => {
                return new Promise<void>(async (res, rej) => {
                  await entityManager.getRepository(UsuarioEntity).find();
                  // validar si hay periodos contables en BDD
                  // entityManager.getRepository(UsuarioEntity).find()
                  // comentar con un logger lo que esta ocurriendo en este estado variables que llegan etc
                  res(); // OnDone
                  // rej();// OnError
                });
              },
              onDone: {
                target: 'ValidarPeriodoContableExisteYEstaActivo',
                actions: assign<GestionPeriodoContableContexto001>({}),
              },
              onError: {
                target: 'CrearPeriodoContableYCuentasContableEnCero',
                actions: assign<GestionPeriodoContableContexto001>({}),
              },
            },
          },
          ValidarPeriodoContableExisteYEstaActivo: {
            invoke: {
              id: 'ValidarPeriodoContableExisteYEstaActivo', // Revision Respuesta Promesa
              src: (context, event) => {
                return new Promise<void>(async (res, rej) => {
                  await entityManager.getRepository(UsuarioEntity).find();
                  // validar si el periodo contable enviado existe y esta en estado activo
                  // entityManager.getRepository(UsuarioEntity).find()
                  // comentar con un logger lo que esta ocurriendo en este estado variables que llegan etc
                  res(); // OnDone
                  // rej();// OnError
                });
              },
              onDone: {
                target: 'CrearPeriodoContableConValoresSaldosCreditos',
                actions: assign<GestionPeriodoContableContexto001>({}),
              },
              onError: {
                target: 'ErrorNoExisteOperiodoDiferenteActivo',
                actions: assign<
                  GestionPeriodoContableContexto001,
                  ResErrorAbstract
                >({
                  error: (context, event) => event.data.error,
                  mensajeError: (context, event) => event.data.mensajeError,
                }),
              },
            },
          },
          ErrorNoExisteOperiodoDiferenteActivo: {
            type: 'final',
            data: {
              error: 500,
            },
          },
          CrearPeriodoContableConValoresSaldosCreditos: {
            invoke: {
              id: 'CrearPeriodoContableConValoresSaldosCreditos', // Revision Respuesta Promesa
              src: (context, event) => {
                return new Promise<any>(async (res, rej) => {
                  await entityManager.getRepository(UsuarioEntity).find();
                  // tipo periodo contable
                  // Crear periodo contable con los valores de saldos creditos y debitos en cero
                  // de todos los meses de ese periodo contable
                  // entityManager.getRepository(UsuarioEntity).find()
                  // comentar con un logger lo que esta ocurriendo en este estado variables que llegan etc
                  res({}); // OnDone enviar la respuesta de periodo contable
                  // rej();// OnError
                });
              },
              onDone: {
                target: 'CrearCuentasContablesConAnioReferencia',
                actions: assign<
                  GestionPeriodoContableContexto001,
                  GestionPeriodoContableRDone001002
                >({
                  periodoContable: (context, event) =>
                    event.data.periodoContable,
                }),
              },
            },
          },
          CrearPeriodoContableYCuentasContableEnCero: {
            invoke: {
              id: 'CrearPeriodoContableYCuentasContableEnCero', // Revision Respuesta Promesa
              src: (context, event) => {
                return new Promise<TGestionPeriodoContableRDone001001>(
                  async (res, rej) => {
                    await entityManager.getRepository(UsuarioEntity).find();
                    // tipo periodo contable
                    // Crear periodo contable en cero y cuentas contables en cero
                    // entityManager.getRepository(UsuarioEntity).find()
                    // comentar con un logger lo que esta ocurriendo en este estado variables que llegan etc
                    res({ cuentasContables: [], periodoContable: {} }); // OnDone enviar la respuesta de periodo contable
                    // rej();// OnError
                  },
                );
              },
              onDone: {
                target:
                  'DeshabilitarPeriodoContableAnteriorYActivarNuevoPeriodoContable',
                actions: assign<
                  GestionPeriodoContableContexto001,
                  GestionPeriodoContableRDone001001
                >({
                  periodoContable: (context, event) =>
                    event.data.periodoContable,
                  cuentasContables: (context, event) =>
                    event.data.cuentasContables,
                }),
              },
            },
          },
          CrearCuentasContablesConAnioReferencia: {
            invoke: {
              id: 'CrearCuentasContablesConAnioReferencia', // Revision Respuesta Promesa
              src: (context, event) => {
                return new Promise<TGestionPeriodoContableRDone001003>(
                  async (res, rej) => {
                    await entityManager.getRepository(UsuarioEntity).find();
                    // tipo periodo contable
                    // Crear periodo contable en cero y cuentas contables en cero
                    // entityManager.getRepository(UsuarioEntity).find()
                    // comentar con un logger lo que esta ocurriendo en este estado variables que llegan etc
                    res({ cuentasContables: [] }); // OnDone enviar la respuesta de periodo contable
                    // rej();// OnError
                  },
                );
              },
              onDone: {
                target:
                  'DeshabilitarPeriodoContableAnteriorYActivarNuevoPeriodoContable',
                actions: assign<
                  GestionPeriodoContableContexto001,
                  GestionPeriodoContableRDone001003
                >({
                  cuentasContables: (context, event) =>
                    event.data.cuentasContables,
                }),
              },
            },
          },
          DeshabilitarPeriodoContableAnteriorYActivarNuevoPeriodoContable: {
            invoke: {
              id: 'DeshabilitarPeriodoContableAnteriorYActivarNuevoPeriodoContable', //Promesa Revision Numero
              src: (context, event) => {
                return new Promise<TGestionPeriodoContableREstado001001>(
                  async (res, rej) => {
                    const respuesta = await entityManager
                      .getRepository(UsuarioEntity)
                      .find();
                    // Deshabilitar el periodo contable anterior y el nuevo periodo ponerlo en activo
                    // entityManager.getRepository(UsuarioEntity).find()
                    // comentar con un logger lo que esta ocurriendo en este estado variables que llegan etc
                    res({ usuarios: respuesta }); // OnDone
                    // rej();// OnError
                  },
                );
              },
              onDone: {
                target: 'resueltoCorrectamente',
                actions: assign<
                  GestionPeriodoContableContexto001<TGestionPeriodoContableREstado001001>,
                  GestionPeriodoContableREstado001001
                >({
                  respuestaEstado: (context, event) => event.data,
                }),
              },
            },
          },
          resueltoCorrectamente: {
            type: 'final',
            data: {
              mensaje: 'Terminado exitosamente',
            },
          },
        },
      });
    } catch (error) {
      console.log(error);
      throw new Error('Error');
    }
  };
}
