import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { CouponBookService } from './couponBook.service';
import { CouponCodeService } from './couponCode.service';
import { CreateCouponBookDto } from './dto/createCouponBook.dto';
import { UploadCouponCodesDto } from './dto/uploadCouponCodes.dto';
import { AssignCouponDto } from './dto/assignCoupon.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('coupons')
@Controller('coupon')
export class CouponBookController {
    constructor(
        private readonly couponBookService: CouponBookService,
        private readonly couponCodeService: CouponCodeService,
    ) {}

    @Post()
    @ApiOperation({ summary: 'Create a new coupon book' })
    @ApiResponse({ status: 201, description: 'The coupon book has been successfully created.' })
    @ApiResponse({ status: 400, description: 'Bad request.' })
    create(@Body() createCouponBookDto: CreateCouponBookDto) {
        console.log(createCouponBookDto);
        return this.couponBookService.create(createCouponBookDto);
    }

    @Post('codes/:id?')
    @ApiOperation({ summary: 'Upload coupon codes to a coupon book' })
    @ApiParam({ name: 'id', required: false, description: 'ID of the coupon book' })
    @ApiResponse({ status: 201, description: 'The coupon codes have been successfully uploaded.' })
    @ApiResponse({ status: 404, description: 'Coupon book not found.' })
    @ApiResponse({ status: 409, description: 'Some codes already exist.' })
    uploadCodes(@Param('id') id: string, @Body() uploadCouponCodesDto: UploadCouponCodesDto) {
        return this.couponCodeService.uploadCodes(id, uploadCouponCodesDto.codes);
    }

    @Post('assign')
    @ApiOperation({ summary: 'Assign a random coupon to a user' })
    @ApiResponse({ status: 200, description: 'The coupon has been successfully assigned.' })
    @ApiResponse({ status: 404, description: 'No available coupons found.' })
    assignRandomCoupon(@Body() assignCouponDto: AssignCouponDto) {
        return this.couponCodeService.assignRandomCouponCode(assignCouponDto.userId);
    }

    @Post('assign/:code')
    @ApiOperation({ summary: 'Assign a specific coupon to a user' })
    @ApiParam({ name: 'code', description: 'The coupon code to assign' })
    @ApiResponse({ status: 200, description: 'The coupon has been successfully assigned.' })
    @ApiResponse({ status: 404, description: 'Coupon code not found.' })
    @ApiResponse({ status: 409, description: 'Coupon has already been redeemed.' })
    assignSpecificCoupon(@Param('code') code: string, @Body() assignCouponDto: AssignCouponDto) {
        return this.couponCodeService.assignSpecificCouponCode(code, assignCouponDto.userId);
    }

    @Post('lock/:code')
    @ApiOperation({ summary: 'Lock a coupon for redemption' })
    @ApiParam({ name: 'code', description: 'The coupon code to lock' })
    @ApiResponse({ status: 200, description: 'The coupon has been successfully locked.' })
    @ApiResponse({ status: 404, description: 'Coupon code not found.' })
    @ApiResponse({ status: 409, description: 'Coupon is not assigned to this user or already locked.' })
    lockCoupon(@Param('code') code: string, @Body() assignCouponDto: AssignCouponDto) {
        return this.couponCodeService.lockCouponCode(code, assignCouponDto.userId);
    }

    @Post('redeem/:code')
    @ApiOperation({ summary: 'Redeem a coupon' })
    @ApiParam({ name: 'code', description: 'The coupon code to redeem' })
    @ApiResponse({ status: 200, description: 'The coupon has been successfully redeemed.' })
    @ApiResponse({ status: 404, description: 'Coupon code not found.' })
    @ApiResponse({ status: 409, description: 'Coupon is not assigned to this user, already redeemed, or not locked.' })
    redeemCoupon(@Param('code') code: string, @Body() assignCouponDto: AssignCouponDto) {
        return this.couponCodeService.redeemCouponCode(code, assignCouponDto.userId);
    }

    @Get()
    @ApiOperation({ summary: 'Get all coupon books' })
    @ApiResponse({ status: 200, description: 'Return all coupon books.' })
    findAll() {
        return this.couponBookService.findAll();
    }
}