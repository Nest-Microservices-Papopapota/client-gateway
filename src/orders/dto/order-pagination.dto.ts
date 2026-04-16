import { IsEnum, IsOptional } from "class-validator";
import { PaginationDto } from "src/common";
import { OrderStatus, orderStatusList } from "../enum";

export class OrderPaginationDto extends PaginationDto {
    @IsOptional()
    @IsEnum(orderStatusList,{
        message: `status must be one of the following values: ${orderStatusList.join(", ")}`
    })
    status?: OrderStatus;

}