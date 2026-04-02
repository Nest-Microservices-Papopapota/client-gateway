import { BadRequestException, Body, Controller, Delete, Get, HttpCode, HttpStatus, Inject, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, firstValueFrom } from 'rxjs';
import { PaginationDto } from 'src/common';
import { PRODUCTS_SERVICE } from 'src/config';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(
    @Inject(PRODUCTS_SERVICE) private readonly productsClient: ClientProxy
  ) { }

  @HttpCode(HttpStatus.CREATED)
  @Post()
  create(
    @Body() createProductDto: CreateProductDto
  ) {
    return this.productsClient.send(
      { cmd: 'create_product' },
      createProductDto
    )
  }


  @Get()
  findAll(
    @Query() paginationDto: PaginationDto
  ) {
    return this.productsClient.send(
      { cmd: 'find_all_products' },
      paginationDto
    );
  }

  @Get(':id')
  async find(
    @Param('id') id: string,
  ) {
    // return this.productsClient.send(
    //   { cmd: 'find_one_product' },
    //   { id }
    // ).pipe(
    //   catchError((error) => {
    //     throw new RpcException(error);
    //   })
    // );
    try {
      const product = await firstValueFrom(
        this.productsClient.send(
          { cmd: 'find_one_product' },
          { id }
        )
      )
      return product;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto
  ) {
    try {
      const product = await firstValueFrom(
        this.productsClient.send(
          { cmd: 'update_product' },
          { id, ...updateProductDto }
        )
      );
      return product;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number
  ) {
    try {
      const product = await firstValueFrom(
        this.productsClient.send(
          { cmd: 'delete_product' },
          { id }
        )
      );
      return product;
    } catch (error) {
      throw new RpcException(error);
    }
  }

}
