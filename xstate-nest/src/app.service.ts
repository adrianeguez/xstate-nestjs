import {Injectable} from '@nestjs/common';
import {assign, createMachine, interpret, State} from 'xstate';
import {ProxyService} from "./proxy-module/proxy.service";
import {firstValueFrom} from "rxjs";
import {MicrounoMessagesEnum} from "./enums/microuno-messages.enum";
import {Interpreter} from "xstate/lib/interpreter";

interface Context {
    retries: number;
}

@Injectable()
export class AppService {
    constructor(
        private readonly proxyService: ProxyService,
    ) {
    }

    private _clientProxyUMicroUno = this.proxyService.clientProxyMicroUno();
    toggleMachine = createMachine({
        id: 'toggle',
        initial: 'inactive',
        states: {
            inactive: {
                on: {
                    TOGGLE: 'loading'
                }
            },
            loading: {
                invoke: {
                    id: 'transaccionUno',
                    src: (context, event) => {
                        console.log(context, event);
                        return firstValueFrom(
                            this._clientProxyUMicroUno.send(
                                MicrounoMessagesEnum.Transaccion,
                                {id: 1}
                            )
                        )
                    },
                    onDone: {
                        target: 'resolved',
                        actions: assign({
                            respuesta: (_, event) => event.data
                        })
                    },
                    onError: 'rejected'
                }
            },
            resolved: {

                type: 'final'
            },
            rejected: {
                on: {
                    CANCEL: 'inactive'
                }
            },
            // finish: {
            //     type: 'final'
            // }
        }
    });

    toggleService = interpret(this.toggleMachine)
        .onTransition(
            (state) => {
                console.log(state);
                console.log(JSON.stringify(state.toJSON()));
                console.log(state.value);
            }
        )
        .start();

    a = {} as any
    counter = 1;

    toggle(event: string, id?: string) {
        if (!id) {
            this.toggleService.start()
            id = this.counter.toString();
            this.counter++;
        } else {
            this.toggleService.start(State.from(this.a[id]));
        }
        const json = this.toggleService.send(event, {id: '1', event})
            .toJSON();
        this.a[id] = json;
        return {...json, idManticore: id};
    }

    getHello(): string {
        return 'Hello World!';
    }
}
