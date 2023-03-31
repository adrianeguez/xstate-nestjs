import { Injectable } from '@nestjs/common';
import { assign, createMachine, interpret, State } from 'xstate';
import { ProxyService } from './proxy-module/proxy.service';
import { firstValueFrom } from 'rxjs';
import { MicrounoMessagesEnum } from './enums/microuno-messages.enum';
import { Interpreter } from 'xstate/lib/interpreter';
import { EjemploRetryContexto } from './xstate/ejemplo-retry.contexto';
import { EjemploRetryEventos } from './xstate/ejemplo-retry.eventos';
import { EjemploRetryTipoEstado } from './xstate/ejemplo-retry.tipo-estado';
import {
  EjemploRetryPrnRespuesta,
  EjemploRetryPrnRespuestaDone,
} from './xstate/ejemplo-retry.prn.respuesta-done';
import {
  EjemploRetryPrnError,
  EjemploRetryPrnRespuestaError,
} from './xstate/ejemplo-retry.prn.respuesta-error';
import { EventObject } from 'xstate/es';

@Injectable()
export class AppService {
  numeroMaximoRetries = 4;
  tiempoDelay = 1000;

  ejemploRetry = (parametroNumero: number) =>
    createMachine<
      EjemploRetryContexto,
      EjemploRetryEventos,
      EjemploRetryTipoEstado
    >({
      predictableActionArguments: true,
      id: 'ejemploRetryId',
      initial: 'porEmpezar',
      context: {
        delay: this.tiempoDelay,
        error: undefined,
        parametroNumero,
        numeroRetries: 0,
        numeroEsMayorADiezYEsPar: false,
        revisionNumeroCompletado: false,
      },
      states: {
        porEmpezar: {
          on: {
            REVISAR_SI_ES_PAR: 'promesaRevisionNumero',
          },
        },
        promesaRevisionNumero: {
          invoke: {
            id: 'transaccionPRN01', //Promesa Revision Numero
            src: (context, event) => {
              console.log({
                message: `tiene un delay de: ${context.delay}`,
                context,
                event: event.type,
              });
              return new Promise<EjemploRetryPrnRespuesta>((res, rej) => {
                setTimeout(() => {
                  if (context.parametroNumero % 2 === 0) {
                    res({
                      numeroEsMayorADiezYEsPar: context.parametroNumero > 10,
                      revisionNumeroCompletado: true,
                    });
                  } else {
                    rej({
                      mensaje: 'No ok',
                      error: 500,
                      numeroRetries: context.numeroRetries + 1,
                    } as EjemploRetryPrnError);
                  }
                }, context.delay);
              });
            },
            onDone: {
              target: 'revisarRespuestaPromesaRevision',
              actions: assign<
                EjemploRetryContexto,
                EjemploRetryPrnRespuestaDone
              >({
                numeroEsMayorADiezYEsPar: (context, event) =>
                  event.data.numeroEsMayorADiezYEsPar,
                revisionNumeroCompletado: (context, event) =>
                  event.data.revisionNumeroCompletado,
              }),
            },
            onError: {
              target: 'revisarRespuestaPromesaRevision',
              actions: assign<
                EjemploRetryContexto,
                EjemploRetryPrnRespuestaError
              >({
                error: (context, event) => event.data.error,
                delay: (context, event) => context.delay + this.tiempoDelay,
                numeroRetries: (context, event) => event.data.numeroRetries,
              }),
            },
          },
        },
        revisarRespuestaPromesaRevision: {
          invoke: {
            id: 'transaccionRRPR02', // Revision Respuesta Promesa
            src: (context, event) => {
              return new Promise<void>((res, rej) => {
                console.log(
                  `Revisando si numero es par ${context.revisionNumeroCompletado}`,
                );
                if (context.revisionNumeroCompletado) {
                  console.log(
                    `Numero ES par ${context.revisionNumeroCompletado}`,
                  );
                  res();
                } else {
                  console.log(
                    `Numero NO ES par ${context.revisionNumeroCompletado}`,
                  );
                  rej();
                }
              });
            },
            onDone: {
              target: 'resueltoCorrectamente',
              actions: [],
            },
            onError: {
              target: 'retryPromesaRevisionNumero',
              actions: [],
            },
          },
        },
        retryPromesaRevisionNumero: {
          invoke: {
            id: 'transaccionRPRN03', // Revision Respuesta Promesa
            src: (context, event) => {
              return new Promise<void>((res, rej) => {
                console.log(
                  `Revisando maximo de retries. Actual: ${context.numeroRetries} Maximo: ${this.numeroMaximoRetries}`,
                );
                if (context.numeroRetries > this.numeroMaximoRetries) {
                  console.log(`Llego al maximo numero de retries`);
                  rej();
                } else {
                  console.log(`Reiniciando revision`);
                  res();
                }
              });
            },
            onDone: {
              target: 'promesaRevisionNumero',
              actions: [],
            },
            onError: {
              target: 'resueltoConErrorDeNumeroDeRetriesMaximo',
              actions: [],
            },
          },
        },
        resueltoConErrorDeNumeroDeRetriesMaximo: {
          type: 'final',
          data: {
            error: 500,
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

  constructor(private readonly proxyService: ProxyService) {}

  private _clientProxyUMicroUno = this.proxyService.clientProxyMicroUno();

  machine = createMachine({
    id: 'toggle',
    initial: 'inactive',
    context: {},
    states: {
      inactive: {
        on: {
          TOGGLE: 'loading',
        },
      },
      loading: {
        invoke: {
          id: 'transaccionUno',
          src: (context, event) => {
            console.log(context, event);
            return new Promise(async (res, rej) => {
              try {
                const a = await firstValueFrom(
                  this._clientProxyUMicroUno.send(
                    MicrounoMessagesEnum.Transaccion,
                    { id: 1 },
                  ),
                );
                res(a);
              } catch (e) {
                console.error(e);
                rej(e);
              }
            });
          },
          onDone: {
            target: 'resolved',
            actions: assign({
              respuesta: (_, event) => event.data,
            }),
          },
          onError: {
            target: 'rejected',
            actions: assign({ error: (context, event) => event.data }),
          },
        },
      },
      resolved: {
        type: 'final',
      },
      rejected: {
        on: {
          CANCEL: 'inactive',
        },
      },
      // finish: {
      //     type: 'final'
      // }
    },
  });
  toggleService = () => {
    return interpret(this.machine);
  };
  // .onTransition(
  //     (state) => {
  //         console.log(state);
  //         console.log(JSON.stringify(state.toJSON()));
  //         console.log(state.value);
  //     }
  // )
  // .start();

  a = {} as any;
  counter = 1;

  toggle(event: string, id?: string) {
    let machine: any;
    if (!id) {
      machine = this.toggleService().start();
      id = this.counter.toString();
      this.counter++;
    } else {
      machine = this.toggleService().start(State.from(JSON.parse(this.a[id])));
    }
    const json = machine.send(event, { id: '1', event });
    this.a[id] = JSON.stringify(json);
    console.log(json.toJSON());
    console.log(json.value);
    return { ...json, idManticore: id };
  }

  getHello(): string {
    return 'Hello World!';
  }

  exampleDB = {};

  empezarMaquinaEjemplo(numero: number, previousState?: State<any, any>) {
    console.log(`*** LLEGO NUMERO: ${numero}`);
    const a = interpret(this.ejemploRetry(numero)).start(previousState);
    a.send('REVISAR_SI_ES_PAR');
    a.onTransition((state, event) => {
      console.log('***');
      console.log(state.event);
      console.log('-----');
      console.log(JSON.stringify(state));
      console.log('-----');
      console.log(event.type);
      console.log('***');
    });
    a.onDone((b) => {
      console.log('/////////////');
      console.log('TERMINO LA MAQUINA');
      console.log({ b, contexto: a.getSnapshot().context });
      console.log('/////////////');
      a.stop();
    });
    a.onStop(() => {
      console.log('/////////////');
      console.log('STOP envviado, limpiado recursos');
      console.log('/////////////');
    });
  }
  empezarMaquinaEnAlgunPunto(stateString: string) {
    const previousState = State.create(JSON.parse(stateString));
    this.empezarMaquinaEjemplo(0, previousState);
  }
}
