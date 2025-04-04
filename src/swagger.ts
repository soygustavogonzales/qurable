import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const setupSwagger = (app) => {
  const config = new DocumentBuilder()
    .setTitle('Coupon Management API')
    .setDescription('API for managing coupons, coupon books, and coupon codes')
    .setVersion('1.0')
    .addTag('coupons')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
}; 