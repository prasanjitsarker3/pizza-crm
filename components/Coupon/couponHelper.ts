import { Coupon, GiftKeyType } from "@/types/coupon.type";
import { format } from "date-fns";
import { DollarSign, Gift, Percent, Ticket } from "lucide-react";



// Helper function to get value display
export const getValueDisplay = (coupon: Coupon) => {
    switch (coupon.type) {
        case GiftKeyType.POINTS:
            return `${coupon.pointsValue} Points`;
        case GiftKeyType.PERCENT_OFF:
            return `${coupon.percentValue}% Off`;
        case GiftKeyType.AMOUNT_OFF:
            return `৳${coupon.amountValue} Off`;
        case GiftKeyType.COUPON:
            return "Coupon";
        default:
            return "-";
    }
};



// Check if coupon is expired
export const isExpired = (expiresAt: string | null) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
};


export const formatDate = (dateString: string | null) => {
    if (!dateString) return "No expiry";
    return format(new Date(dateString), "MMM dd, yyyy");
};