import { Order } from '@/types/order.type';
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../ui/select';
import { useUpdateStatusMutation } from '@/redux/Api/orderApi';
import { toast } from 'sonner';

enum OrderStatus {
    PENDING = 'PENDING',
    CONFIRMED = 'CONFIRMED',
    COOKING = 'COOKING',
    READY = 'READY',
    OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED'
}

const statusConfig = {
    [OrderStatus.PENDING]: {
        label: 'Pending',
        color: 'bg-yellow-500',
        textColor: 'text-yellow-600'
    },
    [OrderStatus.CONFIRMED]: {
        label: 'Confirmed',
        color: 'bg-blue-500',
        textColor: 'text-blue-600'
    },
    [OrderStatus.COOKING]: {
        label: 'Cooking',
        color: 'bg-orange-500',
        textColor: 'text-orange-600'
    },
    [OrderStatus.READY]: {
        label: 'Ready',
        color: 'bg-purple-500',
        textColor: 'text-purple-600'
    },
    [OrderStatus.OUT_FOR_DELIVERY]: {
        label: 'Out for Delivery',
        color: 'bg-indigo-500',
        textColor: 'text-indigo-600'
    },
    [OrderStatus.COMPLETED]: {
        label: 'Completed',
        color: 'bg-green-500',
        textColor: 'text-green-600'
    },
    [OrderStatus.CANCELLED]: {
        label: 'Cancelled',
        color: 'bg-red-500',
        textColor: 'text-red-600'
    }
};

interface Props {
    orderData: Order;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const OrderStatusUpdateModal = ({
    orderData,
    open,
    onOpenChange,
}: Props) => {

    const [selectedStatus, setSelectedStatus] = useState<string>(
        orderData.orderStatus
    );
    const [isUpdating, setIsUpdating] = useState(false);
    const [updateStatus, { isLoading: isUpdated }] = useUpdateStatusMutation()

    const handleUpdateStatus = async () => {
        setIsUpdating(true);
        const toastId = toast.loading("Updateing....")
        try {

            const response = await updateStatus({
                id: orderData.id,
                orderStatus: selectedStatus,
            }).unwrap();

            if (response?.statusCode === 200) {
                toast.success(response?.message, { id: toastId, duration: 1000 })
                onOpenChange(false);
            }
            else {
                toast.error(response?.message || response?.data?.message, { id: toastId, duration: 1000 })
            }

        } catch (error: any) {
            toast.error(error?.message || error?.data?.message, { id: toastId, duration: 1000 })
            console.error('Error updating status:', error);
        } finally {
            setIsUpdating(false);
        }
    };

    const currentStatus = orderData.orderStatus as OrderStatus;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-150 overflow-y-auto shadow-none border-0">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">Update Order Status</DialogTitle>
                    <DialogDescription>
                        Update the status for order #{orderData.trxId}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    <div>
                        <p className="text-sm font-medium text-gray-700 mb-3">Select New Status</p>
                        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select status py-5">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-3 h-3 rounded-full ${statusConfig[selectedStatus as OrderStatus]?.color}`}></div>
                                        <span>{statusConfig[selectedStatus as OrderStatus]?.label}</span>
                                    </div>
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                {Object.entries(OrderStatus).map(([key, value]) => {
                                    const config = statusConfig[value];
                                    return (
                                        <SelectItem key={key} value={value}>
                                            <div className="flex items-center gap-2">
                                                <div className={`w-3 h-3 rounded-full ${config.color}`}></div>
                                                <span>{config.label}</span>
                                            </div>
                                        </SelectItem>
                                    );
                                })}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-4">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isUpdating}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleUpdateStatus}
                        disabled={selectedStatus === currentStatus || isUpdating}
                        className=" bg-primary text-white"
                    >
                        {isUpdating ? 'Updating...' : 'Update Status'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default OrderStatusUpdateModal;