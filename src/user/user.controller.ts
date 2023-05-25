import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Public } from 'src/auth/auth.decorator';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) { }


  @Public()
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Public()
  @Get(':uuid')
  findOne(@Param('uuid') uuid: string) {
    return this.userService.findOne(uuid);
  }


  @Patch(':uuid')
  update(@Param('uuid') uuid: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(uuid, updateUserDto);
  }

  @Delete(':uuid')
  remove(@Param('uuid') uuid: string) {
    return this.userService.remove(uuid);
  }
}
