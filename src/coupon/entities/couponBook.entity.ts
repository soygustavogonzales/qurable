import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { CouponCode } from './couponCode.entity';



@Entity()
export class CouponBook {

    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    name: string;

    @Column()
    codePattern: string;

    @Column({
        nullable: true
    })
    maxRedemptionsPerUser: number;

    @Column('decimal', { precision: 10, scale: 2 })
    discountAmount: number;

    @OneToMany(() => CouponCode, couponCode => couponCode.couponBook)
    codes : CouponCode[]

    @CreateDateColumn({ type: 'timestamp' , default: () => 'CURRENT_TIMESTAMP'})
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' , default: () => 'CURRENT_TIMESTAMP'})
    updatedAt: Date;



} 