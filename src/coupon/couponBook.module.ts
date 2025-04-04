import { Module } from '@nestjs/common';
import { CouponBookController } from './couponBook.controller';
import { CouponBookService } from './couponBook.service';
import { CouponCodeService } from './couponCode.service';
import { CouponBook } from './entities/couponBook.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CouponCode } from './entities/couponCode.entity';
import { User } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CouponBook, CouponCode, User])],
  controllers: [CouponBookController],
  providers: [CouponBookService, CouponCodeService]
})
export class CouponBookModule {}
