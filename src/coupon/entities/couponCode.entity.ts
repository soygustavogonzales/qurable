import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { CouponBook } from './couponBook.entity';

@Entity('CouponCode')
export class CouponCode {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  code: string;

  @Column({ default: false })
  isLocked: boolean;
  
  @Column({ default: false })
  isRedeemed: boolean;    
  
  @ManyToOne(() => CouponBook, couponBook => couponBook.codes)
  couponBook: CouponBook;
  
  @Column({ nullable: true })
  assignedTo: string;
  
  @Column({ nullable: true })
  redeemedAt: Date;
  
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
} 