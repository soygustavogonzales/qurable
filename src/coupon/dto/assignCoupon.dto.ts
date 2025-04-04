import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignCouponDto {
  @ApiProperty({
    description: 'The ID of the user to assign the coupon to',
    example: 'user-123'
  })
  @IsString()
  @IsNotEmpty()
  userId: string;
} 