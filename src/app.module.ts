import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { NodeMailerService } from './node-mailer/node-mailer.service';
import { NodeMailerModule } from './node-mailer/node-mailer.module';
import { OrderModule } from './order/order.module';
import { ObjectStorageModule } from './object-storage/object-storage.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      migrations: ['db/migrations/*.js'],
      synchronize: true,
      logging: true,
    }),
    UserModule,
    AuthModule,
    NodeMailerModule,
    OrderModule,
    ObjectStorageModule
  ],
  providers: [NodeMailerService],
})
export class AppModule { }
