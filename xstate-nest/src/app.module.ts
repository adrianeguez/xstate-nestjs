import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProxyModule } from './proxy-module/proxy.module';
import { UsuarioModule } from './modulo-contabilidad/usuario/usuario.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioEntity } from './modulo-contabilidad/usuario/usuario.entity';

@Module({
  imports: [
    ProxyModule,
    UsuarioModule,
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: './bdd/bdd.sqlite',
      entities: [UsuarioEntity], // entidades de TOODOO el aplicativo
      synchronize: true, // true => edita las columnas y tablas // false => nada
      dropSchema: true, // true => borra toda la base de datos! cuidado! // false => nada
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
