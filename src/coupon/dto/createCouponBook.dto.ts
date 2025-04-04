import { IsString, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCouponBookDto {
    @ApiProperty({
        description: 'The name of the coupon book',
        example: 'Summer Discounts 2024'
    })
    @IsString()
    name: string;

    @ApiProperty({
        description: 'The pattern for coupon codes',
        example: 'SUMMER-{6}'
    })
    @IsString()
    codePattern: string;

    @ApiProperty({
        description: 'Maximum number of redemptions allowed per user',
        example: 1,
        required: false
    })
    @IsOptional()
    @IsNumber()
    maxRedemptionsPerUser?: number;

    @IsOptional()
    @IsNumber()
    discountAmount?:number
}