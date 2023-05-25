import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { UserModule } from 'src/user/user.module';
import { OrderItems } from './entities/orderItems.entity';
import { ObjectStorageModule } from 'src/object-storage/object-storage.module';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItems]), UserModule, ObjectStorageModule],
  controllers: [OrderController],
  providers: [OrderService]
})
export class OrderModule { }
