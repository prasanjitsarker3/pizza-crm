import { TagTypes } from "@/types/tagTypes";
import { baseApi } from "../baseApi";
import { string } from "zod";

export const productApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createProduct: builder.mutation({
            query: (data) => {
                return {
                    url: `/products`,
                    method: "POST",
                    body: data,
                };
            },
            invalidatesTags: [TagTypes.product]
        }),
        getAllProducts: builder.query({
            query: (args: any) => {
                console.log(args)
                return {
                    url: "/products",
                    method: "GET",
                    params: args
                }
            },
            providesTags: [TagTypes.product]
        }),

        getNewProducts: builder.query({
            query: (args: any) => {
                return {
                    url: "/products/new",
                    method: "GET",
                    params: args
                }
            },
            providesTags: [TagTypes.product]
        }),
        getSingleProduct: builder.query({
            query: (id: string) => {
                return {
                    url: `/products/${id}`,
                    method: "GET",

                }
            },
            providesTags: [TagTypes.product]
        }),
        updateProduct: builder.mutation({
            query: ({ id, data }: { id: string, data: any }) => {
                return {
                    url: `/products/${id}`,
                    method: "PATCH",
                    body: data
                }
            },
            invalidatesTags: [TagTypes.product]
        }),
        deleteProduct: builder.mutation({
            query: (id: string) => {
                return {
                    url: `/products/${id}`,
                    method: "DELETE",
                }
            },
            invalidatesTags: [TagTypes.product]
        })

    }),
});

export const {
    useCreateProductMutation,
    useGetAllProductsQuery,
    useGetSingleProductQuery,
    useUpdateProductMutation,
    useGetNewProductsQuery,
    useDeleteProductMutation,
    useLazyGetAllProductsQuery

} = productApi;
