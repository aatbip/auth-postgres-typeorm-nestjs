import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Query, UseInterceptors, UploadedFile, UploadedFiles } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { IRequest } from 'typings/interface';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) { }

  // uploadFile(@UploadedFile() file: Express.Multer.File) {
  //   return this.appService.uploadFile(file);
  // }
  @Post()
  @UseInterceptors(FilesInterceptor('image'))
  create(@Body() createOrderDto: CreateOrderDto, @UploadedFiles() image: Array<Express.Multer.File>, @Req() req: IRequest) {

    return this.orderService.create(createOrderDto, req.user, image);

  }

  @Get('paginate?')
  findPaginate(@Query('take') take: number, @Query('page') page: number) {
    return this.orderService.getByPagination(take, page)
  }

  @Get()
  findAll() {
    return this.orderService.findAll();
  }

  @Get('user')
  findAllUserOrder(@Req() req: IRequest) {
    return this.orderService.findAllUserOrder(req.user);
  }

  @Get(':uuid')
  findOne(@Param('uuid') uuid: string) {
    return this.orderService.findOne(uuid);
  }


  @Patch(':uuid')
  @UseInterceptors(FilesInterceptor('image'))
  update(@Param('uuid') uuid: string, @Body() updateOrderDto: UpdateOrderDto, @UploadedFiles() image: Array<Express.Multer.File>) {
    return this.orderService.update(uuid, updateOrderDto, image);
  }

  @Delete(':uuid')
  remove(@Param('uuid') uuid: string) {
    return this.orderService.remove(uuid);
  }
}
