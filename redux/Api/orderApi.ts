import { TagTypes } from "@/types/tagTypes";
import { baseApi } from "../baseApi";

export const orderApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        getAllOrders: builder.query({
            query: (args: any) => {
                return {
                    url: '/orders',
                    method: "GET",
                    params: args
                }
            },
            providesTags: [TagTypes.order]
        }),
        getSingleOrder: builder.query({
            query: (id: string) => {
                return {
                    url: `/orders/${id}`,
                    method: "GET",
                }
            },
            providesTags: [TagTypes.order]
        }),
        deleteOrder: builder.mutation({
            query: (id: string) => {
                return {
                    url: `/orders/${id}`,
                    method: "DELETE"
                }
            },
            invalidatesTags: [TagTypes.order]
        }),
        updateStatus: builder.mutation({
            query: ({ id, orderStatus }) => ({
                url: `/orders/status/${id}`,
                method: "PATCH",
                body: { orderStatus },
            }),
            invalidatesTags: [TagTypes.order],
        }),

        updatePaymentStatus: builder.mutation({
            query: ({ id, paymentStatus }) => ({
                url: `/orders/payment-status/${id}`,
                method: 'PATCH',
                body: { paymentStatus },
            }),
            invalidatesTags: [TagTypes.order],
        }),



    }),
});

export const {
    useGetAllOrdersQuery,
    useGetSingleOrderQuery,
    useDeleteOrderMutation,
    useUpdateStatusMutation,
    useUpdatePaymentStatusMutation
} = orderApi;
