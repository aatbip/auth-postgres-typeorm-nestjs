import { ForbiddenException, Injectable } from '@nestjs/common';
import * as bcrypt from "bcrypt";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private readonly User: Repository<User>) { }

  async create(createUserDto: CreateUserDto) {

    let isUser = await this.User.findOne({
      where: {
        email: createUserDto.email
      }
    })

    if (isUser) {
      throw new ForbiddenException("User Already Exists!");
    }

    let user: User = new User();

    user.email = createUserDto.email;
    user.first_name = createUserDto.first_name;
    user.last_name = createUserDto.last_name;
    user.password = createUserDto.password;

    let newUser = this.User.save(user);
    return newUser;
  }

  async isMatch(email: string, password: string) {
    let user = await this.User.findOne({
      where: {
        email: email
      }
    })
    const isMatch = await bcrypt.compare(password, user.password)

    return isMatch;
  }

  findByEmail(email: string) {
    return this.User.findOne({
      where: {
        email: email
      }
    })
  }

  findAll() {
    return this.User.find();
  }

  findOne(uuid: string) {
    return this.User.findOne({
      where: {
        uuid: uuid
      }
    })
  }


  update(uuid: string, updateUserDto: UpdateUserDto) {

    return this.User.createQueryBuilder().update(User).set({
      first_name: updateUserDto.first_name,
      last_name: updateUserDto.last_name,
      email: updateUserDto.email,
    }).where({ uuid: uuid }).execute()

  }

  remove(uuid: string) {
    this.User.createQueryBuilder().softDelete()
      .where({ uuid: uuid }).execute();

    return "User Deleted!"
  }

  async resetPassword(newPassword: string, email: string) {

    let user = await this.User.findOne({
      where: {
        email: email
      }
    })

    user.password = newPassword;

    await this.User.save(user);

    return {
      success: "Password has been changed!"
    }
  }
}



















