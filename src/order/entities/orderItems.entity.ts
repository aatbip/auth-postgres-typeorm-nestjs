import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, DeleteDateColumn, Entity, Generated, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Order } from "./order.entity";


@Entity({ name: "orderItems" })
export class OrderItems {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Generated('uuid')
  uuid: string;

  @ManyToOne(() => Order, (order) => order.order_items, { onDelete: "CASCADE" })
  order_id: Order;

  @Column()
  name: string;

  @Column()
  image_path: string;

  @Column()
  image_url: string;

  @Column()
  s3_key: string;

  @Column()
  quantity: number;

  @Column()
  single_price: number;

  @Column()
  total_price: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @BeforeInsert()
  @BeforeUpdate()
  private calculateTotalPrice() {
    this.total_price = this.single_price * this.quantity;
  }

}
