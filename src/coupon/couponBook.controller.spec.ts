import { Test, TestingModule } from '@nestjs/testing';
import { CouponBookController } from './couponBook.controller';

describe('CouponController', () => {
  let controller: CouponBookController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CouponBookController],
    }).compile();

    controller = module.get<CouponBookController>(CouponBookController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
