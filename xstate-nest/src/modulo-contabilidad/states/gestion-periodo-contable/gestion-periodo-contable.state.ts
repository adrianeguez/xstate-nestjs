import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { assign, createMachine } from 'xstate';
import { GpcContexto } from './interfaces/gpc.contexto';
import { GpcEventos } from './interfaces/gpc.eventos';
import { GpcTipoEstado } from './interfaces/gpc.tipo-estado';
import { UsuarioEntity } from '../../usuario/usuario.entity';
import { ResErrorAbstract } from '../../../abstract/res-error.abstract';
import {
  ResGpcA002,
  ResGpcA002Done,
} from './respuestas/gpc-a-002.respuesta-done';
import {
  ResGpcA001,
  ResGpcA001Done,
} from './respuestas/gpc-a-001.respuesta-done';
import {
  ResGpcA003,
  ResGpcA003Done,
} from './respuestas/gpc-a-003.respuesta-done';

@Injectable()
export class GestionPeriodoContableState {
  constructor(
    @InjectDataSource()
    public datasource: DataSource,
  ) {}

  tiempoDelay = 1000;

  async iniciar() {
    return await this.datasource.manager.transaction(
      async (transactionalEntityManager) => {},
    );
  }

  instanciaGestionPeriodoState = (contexto: GpcContexto) =>
    createMachine<GpcContexto, GpcEventos, GpcTipoEstado>({
      predictableActionArguments: true,
      id: 'modulo-contabilidad-025/026/001',
      initial: 'porEmpezar',
      context: contexto,
      states: {
        porEmpezar: {
          on: {
            empezar_validacion_anio_repetido: 'validarAnioRepetido',
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
              return new Promise<void>((res, rej) => {
                // validar anio repetido
                // context.entityManager.getRepository(UsuarioEntity).find()
                console.log(
                  `Validando anio repetido con ID periodo contable ${context.periodoContableId} y anio ${context.anio}`,
                );
                res(); // OnDone
                // rej({error: 500, mensajeError: 'Fallo'});// OnError
              });
            },
            onDone: {
              target: 'validarPeriodoContableEnBDD',
              actions: assign<GpcContexto>({}),
            },
            onError: {
              target: 'errorAnioRepetido',
              actions: assign<GpcContexto, ResErrorAbstract>({
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
              return new Promise<void>((res, rej) => {
                // validar si hay periodos contables en BDD
                // context.entityManager.getRepository(UsuarioEntity).find()
                // comentar con un logger lo que esta ocurriendo en este estado variables que llegan etc
                res(); // OnDone
                // rej();// OnError
              });
            },
            onDone: {
              target: 'ValidarPeriodoContableExisteYEstaActivo',
              actions: assign<GpcContexto>({}),
            },
            onError: {
              target: 'CrearPeriodoContableYCuentasContableEnCero',
              actions: assign<GpcContexto>({}),
            },
          },
        },
        ValidarPeriodoContableExisteYEstaActivo: {
          invoke: {
            id: 'ValidarPeriodoContableExisteYEstaActivo', // Revision Respuesta Promesa
            src: (context, event) => {
              return new Promise<void>((res, rej) => {
                // validar si el periodo contable enviado existe y esta en estado activo
                // context.entityManager.getRepository(UsuarioEntity).find()
                // comentar con un logger lo que esta ocurriendo en este estado variables que llegan etc
                res(); // OnDone
                // rej();// OnError
              });
            },
            onDone: {
              target: 'CrearPeriodoContableConValoresSaldosCreditos',
              actions: assign<GpcContexto>({}),
            },
            onError: {
              target: 'ErrorNoExisteOperiodoDiferenteActivo',
              actions: assign<GpcContexto, ResErrorAbstract>({
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
              return new Promise<any>((res, rej) => { // tipo periodo contable
                // Crear periodo contable con los valores de saldos creditos y debitos en cero
                // de todos los meses de ese periodo contable
                // context.entityManager.getRepository(UsuarioEntity).find()
                // comentar con un logger lo que esta ocurriendo en este estado variables que llegan etc
                res({}); // OnDone enviar la respuesta de periodo contable
                // rej();// OnError
              });
            },
            onDone: {
              target: 'CrearCuentasContablesConAnioReferencia',
              actions: assign<GpcContexto, ResGpcA002Done>({
                periodoContable: (context, event) => event.data.periodoContable,
              }),
            },
          },
        },
        CrearPeriodoContableYCuentasContableEnCero: {
          invoke: {
            id: 'CrearPeriodoContableYCuentasContableEnCero', // Revision Respuesta Promesa
            src: (context, event) => {
              return new Promise<ResGpcA001>((res, rej) => { // tipo periodo contable
                // Crear periodo contable en cero y cuentas contables en cero
                // context.entityManager.getRepository(UsuarioEntity).find()
                // comentar con un logger lo que esta ocurriendo en este estado variables que llegan etc
                res({ cuentasContables: [], periodoContable: {} }); // OnDone enviar la respuesta de periodo contable
                // rej();// OnError
              });
            },
            onDone: {
              target:
                'DeshabilitarPeriodoContableAnteriorYActivarNuevoPeriodoContable',
              actions: assign<GpcContexto, ResGpcA001Done>({
                periodoContable: (context, event) => event.data.periodoContable,
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
              return new Promise<any>((res, rej) => { // tipo periodo contable
                // Crear periodo contable en cero y cuentas contables en cero
                // context.entityManager.getRepository(UsuarioEntity).find()
                // comentar con un logger lo que esta ocurriendo en este estado variables que llegan etc
                res({}); // OnDone enviar la respuesta de periodo contable
                // rej();// OnError
              });
            },
            onDone: {
              target:
                'DeshabilitarPeriodoContableAnteriorYActivarNuevoPeriodoContable',
              actions: assign<GpcContexto, ResGpcA003Done>({
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
              return new Promise<void>((res, rej) => {
                // Deshabilitar el periodo contable anterior y el nuevo periodo ponerlo en activo
                // context.entityManager.getRepository(UsuarioEntity).find()
                // comentar con un logger lo que esta ocurriendo en este estado variables que llegan etc
                res(); // OnDone
                // rej();// OnError
              });
            },
            onDone: {
              target: 'resueltoCorrectamente',
              actions: assign<GpcContexto>({}),
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
}
