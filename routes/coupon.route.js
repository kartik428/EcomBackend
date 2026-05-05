import express from 'express';
import { applyCoupon, createCoupon, deleteCoupons, getCoupons } from '../controllers/coupon.controller.js';

const router = express.Router();

router.post('/', createCoupon);
router.get('/', getCoupons);
router.post('/apply', applyCoupon);
router.delete('/:id', deleteCoupons);

export default router;