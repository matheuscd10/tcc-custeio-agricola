import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from './auth/auth.module.js';
import { PessoaModule } from './pessoa/pessoa.module.js';
import { BancoModule } from './banco/banco.module.js';
import { OperacaoModule } from './operacao/operacao.module.js';
import { CusteioModule } from './custeio/custeio.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('DB_USERNAME', 'postgres'),
        password: configService.get<string>('DB_PASSWORD', 'postgres'),
        database: configService.get<string>('DB_DATABASE', 'custeio_agricola'),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),

    AuthModule,
    PessoaModule,
    BancoModule,
    OperacaoModule,
    CusteioModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
