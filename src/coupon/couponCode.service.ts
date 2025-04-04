import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CouponBook } from './entities/couponBook.entity';
import { CouponCode } from './entities/couponCode.entity';
import { In } from 'typeorm';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';

@Injectable()
export class CouponCodeService {
    constructor(
        @InjectRepository(CouponBook)
        private couponBookRepository: Repository<CouponBook>,
        @InjectRepository(CouponCode)
        private couponCodeRepository: Repository<CouponCode>,
        @InjectRedis() private readonly redis: Redis,
    ) {}

    async uploadCodes(couponBookId: string, codes: string[]) {
        const couponBook = await this.couponBookRepository.findOne({ where: { id: couponBookId } });
        if (!couponBook) {
            throw new NotFoundException('Coupon book not found');
        }

        // Check for existing codes
        const existingCodes = await this.couponCodeRepository.find({
            where: { code: In(codes) }
        });

        if (existingCodes.length > 0) {
            throw new ConflictException('Some codes already exist');
        }

        // Create new coupon codes
        const couponCodes = codes.map(code => 
            this.couponCodeRepository.create({
                code,
                couponBook,
                isRedeemed: false
            })
        );

        return this.couponCodeRepository.save(couponCodes);
    }

    async assignRandomCouponCode(userId: string) {
        // Get a random unredeemed coupon
        const coupon = await this.couponCodeRepository
            .createQueryBuilder('coupon')
            .where('coupon.isRedeemed = :isRedeemed', { isRedeemed: false })
            .orderBy('RANDOM()')
            .getOne();

        if (!coupon) {
            throw new NotFoundException('No available coupons found');
        }

        // Assign the coupon to the user
        //coupon.isRedeemed = true;
        coupon.assignedTo = userId;
        await this.couponCodeRepository.save(coupon);

        return coupon;
    }

    async assignSpecificCouponCode(code: string, userId: string) {
        // Find the specific coupon
        const coupon = await this.couponCodeRepository.findOne({ where: { code } });
        
        if (!coupon) {
            throw new NotFoundException('Coupon code not found');
        }

        if (coupon.isRedeemed) {
            throw new ConflictException('Coupon has already been redeemed');
        }

        // Assign the coupon to the user
        //coupon.isRedeemed = true;
        coupon.assignedTo = userId;
        await this.couponCodeRepository.save(coupon);

        return coupon;
    }

    async lockCouponCode(code: string, userId: string) {
        // Find the specific coupon
        const coupon = await this.couponCodeRepository.findOne({ where: { code } });
        
        if (!coupon) {
            throw new NotFoundException('Coupon code not found');
        }

        if (coupon.assignedTo !== userId) {
            throw new ConflictException('Coupon is not assigned to this user');
        }

        // Check if coupon is already locked
        const isLocked = await this.redis.get(`coupon:lock:${code}`);
        if (isLocked) {
            throw new ConflictException('Coupon is already locked');
        }

        // Lock the coupon for 5 minutes
        await this.redis.set(`coupon:lock:${code}`, userId, 'EX', 300);

        return {
            message: 'Coupon locked successfully',
            lockedUntil: new Date(Date.now() + 300000) // 5 minutes from now
        };
    }

    async redeemCouponCode(code: string, userId: string) {
        // Find the specific coupon
        const coupon = await this.couponCodeRepository.findOne({ where: { code } });
        
        if (!coupon) {
            throw new NotFoundException('Coupon code not found');
        }

        if (coupon.assignedTo !== userId) {
            throw new ConflictException('Coupon is not assigned to this user');
        }

        if (coupon.isRedeemed) {
            throw new ConflictException('Coupon has already been redeemed');
        }

        // Check if coupon is locked
        const isLocked = await this.redis.get(`coupon:lock:${code}`);
        if (!isLocked) {
            throw new ConflictException('Coupon must be locked before redemption');
        }

        // Permanently redeem the coupon
        coupon.isRedeemed = true;
        coupon.redeemedAt = new Date();
        await this.couponCodeRepository.save(coupon);

        // Remove the lock
        await this.redis.del(`coupon:lock:${code}`);

        return {
            message: 'Coupon redeemed successfully',
            coupon
        };
    }
} 