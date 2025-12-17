// types/coupon.ts
export enum GiftKeyType {
  POINTS = "POINTS",
  PERCENT_OFF = "PERCENT_OFF",
  AMOUNT_OFF = "AMOUNT_OFF",
  COUPON = "COUPON",
}

export interface CouponMeta {
  key: string;
  value: string;
}

export interface Coupon {
  id: string;
  code: string;
  type: GiftKeyType;
  pointsValue: number | null;
  amountValue: number | null;
  percentValue: number | null;
  maxRedemptions: number;
  redeemedCount: number;
  expiresAt: string | null;
  meta: CouponMeta[] | null;
  img: string | null;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
}

export interface CouponResponse {
  statusCode: number;
  message: string;
  data: Coupon[];
}