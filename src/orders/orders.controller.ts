import { Controller, Get, Post, Body, Param, Inject, ParseUUIDPipe, Query, Patch } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { ORDERS_SERVICE } from 'src/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { OrderPaginationDto, StatusDto } from './dto';
import { PaginationDto } from 'src/common';

@Controller('orders')
export class OrdersController {
  constructor(
    @Inject(ORDERS_SERVICE) private readonly ordersClient: ClientProxy
  ) { }

  @Post()
  async create(
    @Body() createOrderDto: CreateOrderDto
  ) {
    try {
      const order = await firstValueFrom(
        this.ordersClient.send(
          { cmd: 'create_order' },
          createOrderDto
        )
      )
      return order;
    } catch (error: any) {
      throw new RpcException(error);
    }
  }

  @Get()
  findAll(
    @Query() orderPaginationDto: OrderPaginationDto
  ) {
    // return orderPaginationDto;
    return this.ordersClient.send(
      { cmd: 'find_all_orders' },
      orderPaginationDto
    )
  }


  @Get('id/:id')
  async findOne(
    @Param('id', ParseUUIDPipe) id: string
  ) {
    try {
      const product = await firstValueFrom(this.ordersClient.send(
        { cmd: 'find_one_order' },
        { id }
      ));
      return product;
    } catch (error: any) {
      throw new RpcException(error);
    }
  }

  @Get(':status')
  findAllByStatus(
    @Param() statusDto: StatusDto,
    @Query() paginationDto: PaginationDto
  ) {
    return this.ordersClient.send(
      { cmd: 'find_all_orders' },
      { ...paginationDto, status: statusDto.status }
    )
  }

  @Patch(':id')
  async updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() statusDto: StatusDto
  ) {
    try {
      const order = await firstValueFrom(this.ordersClient.send(
        { cmd: 'change_order_status' },
        { id, ...statusDto }
      ))
      return order;
    } catch (error: any) {
      throw new RpcException(error);
    }
  }

}
