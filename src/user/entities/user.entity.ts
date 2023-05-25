import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, DeleteDateColumn, Entity, Generated, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import * as bcrypt from 'bcrypt';
import { Order } from "src/order/entities/order.entity";

@Entity({ name: "user" })
export class User {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Generated("uuid")
  uuid: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column({
    unique: true
  })
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Order, (order) => order.user_id)
  orders: Order[]

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @BeforeInsert()
  @BeforeUpdate()
  private async encryptPassword(): Promise<void> {
    const saltOrRounds = 10;
    const password = this.password;
    this.password = await bcrypt.hash(password, saltOrRounds);
  }

}


