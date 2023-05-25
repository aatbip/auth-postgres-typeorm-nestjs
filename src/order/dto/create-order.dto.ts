import { Status } from "../entities/order.entity";

export interface OrderItem {
  name: string;
  quantity: number;
  single_price: number;
  s3_key: string;
}

export class CreateOrderDto {
  total_quantity: number;
  total_price: number;
  status: Status;
  order_items: OrderItem[];
}

