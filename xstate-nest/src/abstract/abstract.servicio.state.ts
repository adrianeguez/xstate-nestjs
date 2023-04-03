import { interpret, StateMachine } from 'xstate';
import { RespuestaEstado } from './interfaces/respuesta-estado';
import { GestionPeriodoContableContexto001 } from '../modulo-contabilidad/states/gestion-periodo-contable/001/interfaces/gestion-periodo-contable.contexto.001';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';

export class AbstractServicioState {
  tiempoDelay = 1000;

  numeroRetries = 0;

  constructor(private readonly _datasource: DataSource) {}

  async configurarEIniciarFlujo<Contexto = any, Respuesta = any>(objeto: {
    generarInstancia: (
      contexto: Contexto,
      entityManager: EntityManager,
    ) => StateMachine<Contexto, any, any, any>;
    contextoInicial: Contexto;
  }): Promise<RespuestaEstado<Respuesta>> {
    const respuesta: RespuestaEstado<Respuesta> = {
      mensaje: 'Estado gestion periodo contable finalizado con exito',
    };
    try {
      await this._datasource.manager.transaction(
        async (transactionalEntityManager) => {
          const instancia = objeto.generarInstancia(
            objeto.contextoInicial,
            transactionalEntityManager,
          );
          const respuestaInterprete = await this.iniciarEstadoInterpretado<
            GestionPeriodoContableContexto001<Respuesta>
          >(instancia);
          if (respuestaInterprete.error) {
            respuesta.error = respuestaInterprete.error;
            respuesta.mensaje = respuestaInterprete.mensajeError;
          }
          respuesta.data = respuestaInterprete.respuestaEstado;
        },
      );
      return respuesta;
    } catch (error) {
      console.error(error);
      if (respuesta.error === 400) {
        throw new BadRequestException(
          'Error validando datos o por envio de parametros',
        );
      }
      if (respuesta.error === 500) {
        throw new InternalServerErrorException(
          'Error en gestion periodo contable',
        );
      }
      throw new InternalServerErrorException(
        'Error en transaccion en gestion periodo contable ',
      );
    }
  }
  protected iniciarEstadoInterpretado<T = any>(instancia) {
    return new Promise<T>((res) => {
      const runningState = interpret(instancia).start();
      runningState.send('EMPEZAR');
      runningState.onTransition((state, event) => {
        console.log('***');
        console.log(state.event);
        console.log('-----');
        console.log(JSON.stringify(state));
        console.log('-----');
        console.log(event.type);
        console.log('***');
        const contextoActual = runningState.getSnapshot().context;
        if (contextoActual.error) {
          runningState.stop();
        }
      });
      runningState.onDone((b) => {
        console.log('/////////////');
        console.log('TERMINO LA MAQUINA');
        console.log({ contexto: runningState.getSnapshot().context });
        console.log('/////////////');
        runningState.stop();
      });
      runningState.onStop(() => {
        const contextoActual = runningState.getSnapshot().context as any;
        res(contextoActual);
        console.log('/////////////');
        console.log('STOP enviado, limpiado recursos');
        console.log('/////////////');
      });
    });
  }
}
