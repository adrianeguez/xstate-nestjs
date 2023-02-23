import {Controller, Get, Param} from '@nestjs/common';
import {AppService} from './app.service';
import {firstValueFrom} from "rxjs";
import {MicrounoMessagesEnum} from "./enums/microuno-messages.enum";
import {ProxyService} from "./proxy-module/proxy.service";

@Controller()
export class AppController {
    constructor(
        private readonly appService: AppService,
        private readonly proxyService: ProxyService,
    ) {
    }
    private _clientProxyUMicroUno = this.proxyService.clientProxyMicroUno();
    @Get()
    getHello(): string {
        return this.appService.getHello();
    }

    @Get('toggle')
    toggle(): any {
        return this.appService.a;
    }
    @Get('toggle/:event')
    toggleEvent(
        @Param('event') event: string
    ): any {
        console.log(event);
        return this.appService.toggle(event);
    }


    @Get('toggle/:event/:id')
    toggleWithId(
        @Param('event') event: string,
        @Param('id') id: string
    ): any {
        console.log(event);
        return this.appService.toggle(event, id);
    }

    @Get('micro-uno')
    async microUno(): Promise<any> {
        const response = await firstValueFrom(
            this._clientProxyUMicroUno.send(
                MicrounoMessagesEnum.Transaccion,
                {id: 1}
            )
        );
        console.log(response);
        return response;
    }
}
