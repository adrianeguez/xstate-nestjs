import { BadRequestException, Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MicrounoMessagesEnum } from './enums/microuno-messages.enum';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @MessagePattern(MicrounoMessagesEnum.Transaccion)
  async create(@Payload() data: any) {
    console.log(data);
    // throw new BadRequestException('EL AMOR');
    return { mensaje: 'ok' };
  }
}
