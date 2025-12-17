import { TagTypes } from "@/types/tagTypes";
import { baseApi } from "../baseApi";

export const couponApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createGiftCardCoupon: builder.mutation({
            query: (data) => {
                return {
                    url: `/gift-card/create`,
                    method: "POST",
                    body: data,
                };
            },
            invalidatesTags: [TagTypes.coupon]
        }),
        getAllCoupon: builder.query({
            query: (args: any) => {
                return {
                    url: "/gift-card",
                    method: "GET",
                    params: args
                }
            },
            providesTags: [TagTypes.coupon]
        }),
        updateGiftCardCoupon: builder.mutation({
            query: ({ id, data }: { id: string, data: any }) => {
                return {
                    url: `/gift-card/${id}`,
                    method: "PATCH",
                    body: data
                }
            },
            invalidatesTags: [TagTypes.coupon]
        })
        ,
        deleteGiftCardCoupon: builder.mutation({
            query: (id: string) => {
                return {
                    url: `/gift-card/${id}`,
                    method: "DELETE",

                }
            },
            invalidatesTags: [TagTypes.coupon]
        })



    }),
});

export const {
    useCreateGiftCardCouponMutation,
    useGetAllCouponQuery,
    useUpdateGiftCardCouponMutation,
    useDeleteGiftCardCouponMutation

} = couponApi;
