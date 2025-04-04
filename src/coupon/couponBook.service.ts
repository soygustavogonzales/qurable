import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CouponBook } from './entities/couponBook.entity';
import { CreateCouponBookDto } from './dto/createCouponBook.dto';

@Injectable()
export class CouponBookService {
    constructor(
        @InjectRepository(CouponBook)
        private couponBookRepository: Repository<CouponBook>,
    ) {}

    async create(createCouponBookDto: CreateCouponBookDto) {
        const couponBook = this.couponBookRepository.create(createCouponBookDto);
        return this.couponBookRepository.save(couponBook);
    }

    async findAll() {
        return this.couponBookRepository.find({ relations: ['codes'] });
    }
}