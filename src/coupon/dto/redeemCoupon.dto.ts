import { IsString } from 'class-validator';

export class RedeemCouponDto {
    @IsString()
    code: string;

    @IsString()
    userId: string;
}