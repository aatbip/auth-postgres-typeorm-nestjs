import { BeforeInsert, Column, CreateDateColumn, DeleteDateColumn, Entity, Generated, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "src/user/entities/user.entity"
import { OrderItems } from "./orderItems.entity";

export enum Status {
  CREATED = 'created',
  DISPATCHED = 'dispatched',
  CANCELLED = 'cancelled',
  SUCCESS = 'success'
}

@Entity({ name: "order" })
export class Order {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Generated('uuid')
  uuid: string;

  @ManyToOne(() => User, (user) => user.orders)
  user_id: User

  @OneToMany(() => OrderItems, (orderItems) => orderItems.order_id, {
    cascade: true
  })
  order_items: OrderItems[]

  @PrimaryGeneratedColumn('increment')
  order_number: number;

  @Column()
  total_quantity: number;

  @Column()
  total_price: number;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.CREATED
  })
  status: Status

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

}

