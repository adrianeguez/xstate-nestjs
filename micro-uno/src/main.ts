require('dotenv').config()
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
  RmqOptions,
} from '@nestjs/microservices';
import {RabbitmqQueuesEnum} from "./enums/rabbitmq-queues.enum";
import {CONFIG} from "./config/environment";

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: [CONFIG.AMQP_URL],
      queue: RabbitmqQueuesEnum.MicroUno,
    },
  });
  await app.listen();
}
bootstrap();
