import { IsArray, IsString, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UploadCouponCodesDto {
  @ApiProperty({
    description: 'Array of coupon codes to upload',
    example: ['SUMMER-123456', 'SUMMER-789012'],
    type: [String]
  })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @Type(() => String)
  codes: string[];
} 