import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { IPayload } from 'typings/interface';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { OrderItems } from './entities/orderItems.entity';
import { ObjectStorageService } from 'src/object-storage/object-storage.service';
import * as path from 'path';

@Injectable()
export class OrderService {

  constructor(
    @InjectRepository(Order) private readonly orderRepository: Repository<Order>,
    private readonly userService: UserService,
    private readonly storageService: ObjectStorageService
  ) { }

  async create(createOrderDto: CreateOrderDto, user: IPayload, image: Array<Express.Multer.File>) {

    let order_items = [];

    for (let i = 0; i < createOrderDto.order_items.length; i++) {

      const { originalname } = image[i];

      let fileName = `item-${Date.now()}-${originalname}${path.extname(originalname)}`

      const _file = await this.storageService.uploadFile(image[i], fileName);

      console.log(_file.ETag);

      let orderItem = new OrderItems();

      orderItem.quantity = createOrderDto.order_items[i].quantity;
      orderItem.single_price = createOrderDto.order_items[i].single_price;
      orderItem.name = createOrderDto.order_items[i].name;
      orderItem.image_url = _file.Location;
      orderItem.image_path = fileName;
      orderItem.s3_key = JSON.parse(_file.ETag);

      order_items.push(orderItem);
    }

    const order: Order = new Order();

    const _user = await this.userService.findOne(user.sub);

    order.status = createOrderDto.status;
    order.total_price = createOrderDto.total_price;
    order.total_quantity = createOrderDto.total_quantity;
    order.order_items = order_items;
    order.user_id = _user;

    return this.orderRepository.save(order);
  }

  findAll() {
    return this.orderRepository.find({
      relations: {
        order_items: true
      }
    })
  }

  async findAllUserOrder(user: IPayload) {

    return this.orderRepository.find({
      relations: {
        order_items: true
      },
      where: {
        user_id: {
          uuid: user.sub
        }
      }
    })
  }

  findOne(uuid: string) {
    return this.orderRepository.findOne({
      where: {
        uuid: uuid
      },
      relations: {
        order_items: true
      }
    })
  }

  async getByPagination(take: number, page: number) {
    const skip = (page - 1) * take;
    const [result, total] = await this.orderRepository.findAndCount(
      {
        take: take,
        skip: skip
      }
    );

    return {
      data: result,
      count: total
    }
  }

  async update(uuid: string, updateOrderDto: UpdateOrderDto, image: Array<Express.Multer.File>) {

    let order = await this.orderRepository.findOne({
      where: {
        uuid: uuid
      },
      relations: {
        order_items: true
      }
    })

    let keys = order.order_items.map(el => el.s3_key);

    await this.storageService.deleteS3Files(keys)

    let order_items = [];

    for (let i = 0; i < updateOrderDto.order_items.length; i++) {

      const { originalname } = image[i];

      let fileName = `item-${Date.now()}-${originalname}${path.extname(originalname)}`

      const _file = await this.storageService.uploadFile(image[i], fileName);

      let orderItem = new OrderItems();
      orderItem.quantity = updateOrderDto.order_items[i].quantity;
      orderItem.single_price = updateOrderDto.order_items[i].single_price;
      orderItem.name = updateOrderDto.order_items[i].name;
      orderItem.image_url = _file.Location;
      orderItem.image_path = fileName;

      order_items.push(orderItem);
    }

    order.status = updateOrderDto.status;
    order.total_price = updateOrderDto.total_price;
    order.total_quantity = updateOrderDto.total_quantity;
    order.order_items = order_items;

    return this.orderRepository.save(order);
  }

  async remove(uuid: string) {

    let order = await this.orderRepository.findOne({
      where: {
        uuid: uuid
      },
      relations: {
        order_items: true
      }
    })

    await this.storageService.deleteS3Files(order.order_items.map(el => el.s3_key))

    return await this.orderRepository.delete({ uuid: uuid })


  }
}























