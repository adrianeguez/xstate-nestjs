import { Injectable } from '@nestjs/common';
import {
    ClientProxy,
    ClientProxyFactory,
    Transport,
    RmqOptions,
} from '@nestjs/microservices';
import {RabbitmqQueuesEnum} from "../enums/rabbitmq-queues.enum";
import {CONFIG} from "../config/environment";

@Injectable()
export class ProxyService {
    constructor() {}

    clientProxyMicroUno(): ClientProxy {
        return ClientProxyFactory.create({
            transport: Transport.RMQ,
            options: {
                urls: [CONFIG.AMQP_URL],
                queue: RabbitmqQueuesEnum.MicroUno,
            },
        } as RmqOptions);
    }
}