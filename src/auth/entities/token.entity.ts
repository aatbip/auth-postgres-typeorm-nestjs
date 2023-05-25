import { Column, Entity, CreateDateColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "token" })
export class Token {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  token: string;

  @Column()
  email: string;

  @CreateDateColumn()
  created_at: Date;

}
