import { IsEnum, IsOptional } from "class-validator";
import { OrderStatus, orderStatusList } from "../enum";

export class StatusDto {
    @IsOptional()
    @IsEnum(orderStatusList, {
        message: `Status must be one of the following values: ${orderStatusList.join(', ')}`
    })
    status!: OrderStatus;
};