"use client";

import { Order } from '@/types/order.type';
import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../ui/select';
import { toast } from 'sonner';
import { useUpdatePaymentStatusMutation } from '@/redux/Api/orderApi';

enum PaymentStatus {
    UNPAID = 'UNPAID',
    PAID = 'PAID',
    FAILED = 'FAILED',
    REFUNDED = 'REFUNDED',
}



const paymentStatusConfig = {
    [PaymentStatus.UNPAID]: {
        label: 'Unpaid',
        color: 'bg-orange-500',
    },
    [PaymentStatus.PAID]: {
        label: 'Paid',
        color: 'bg-green-500',
    },
    [PaymentStatus.FAILED]: {
        label: 'Failed',
        color: 'bg-red-500',
    },
    [PaymentStatus.REFUNDED]: {
        label: 'Refunded',
        color: 'bg-purple-500',
    },
};

interface Props {
    orderData: Order;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const PaymentStatusUpdateModal = ({
    orderData,
    open,
    onOpenChange,
}: Props) => {
    const [selectedStatus, setSelectedStatus] = useState<PaymentStatus>(
        orderData.paymentStatus as PaymentStatus
    );

    const [isUpdating, setIsUpdating] = useState(false);
    const [updatePaymentStatus] = useUpdatePaymentStatusMutation();

    const handleUpdatePaymentStatus = async () => {

        console.log("Payload", {
            id: orderData.id,
            paymentStatus: selectedStatus,
        }
        )
        const toastId = toast.loading('Updating payment status...');
        setIsUpdating(true);

        try {
            const response = await updatePaymentStatus({
                id: orderData.id,
                paymentStatus: selectedStatus,
            }).unwrap();

            console.log("Payment status update response", response)

            if (response?.statusCode === 200) {
                toast.success(response.message, { id: toastId });
                onOpenChange(false);
            } else {
                toast.error(response?.message, { id: toastId });
            }
        } catch (error: any) {
            toast.error(error?.data?.message || error?.message, { id: toastId });
        } finally {
            setIsUpdating(false);
        }
    };

    const currentStatus = orderData.paymentStatus as PaymentStatus;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">
                        Update Payment Status
                    </DialogTitle>
                    <DialogDescription>
                        Order #{orderData.trxId}
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4 space-y-4">
                    <Select
                        value={selectedStatus}
                        onValueChange={(val) =>
                            setSelectedStatus(val as PaymentStatus)
                        }
                    >
                        <SelectTrigger className=' w-full'>
                            <SelectValue>
                                <div className="flex items-center gap-2">
                                    <span
                                        className={`w-3 h-3 rounded-full ${paymentStatusConfig[selectedStatus].color}`}
                                    />
                                    {paymentStatusConfig[selectedStatus].label}
                                </div>
                            </SelectValue>
                        </SelectTrigger>

                        <SelectContent>
                            {Object.values(PaymentStatus).map((status) => (
                                <SelectItem key={status} value={status}>
                                    <div className="flex items-center gap-2">
                                        <span
                                            className={`w-3 h-3 rounded-full ${paymentStatusConfig[status].color}`}
                                        />
                                        {paymentStatusConfig[status].label}
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex justify-end gap-3">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isUpdating}
                    >
                        Cancel
                    </Button>

                    <Button
                        onClick={handleUpdatePaymentStatus}
                        disabled={
                            selectedStatus === currentStatus || isUpdating
                        }
                    >
                        {isUpdating ? 'Updating...' : 'Update'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default PaymentStatusUpdateModal;
