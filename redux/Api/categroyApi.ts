import { TagTypes } from "@/types/tagTypes";
import { baseApi } from "../baseApi";
import { string } from "zod";

export const categoryApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createNewCategory: builder.mutation({
            query: (data) => {
                return {
                    url: `/categories`,
                    method: "POST",
                    body: data,
                };
            },
            invalidatesTags: [TagTypes.brand]
        }),
        getAllCategorys: builder.query({
            query: (args: any) => {
                return {
                    url: "/categories",
                    method: "GET",
                    params: args
                }
            },
            providesTags: [TagTypes.brand]
        }),
        getCategory: builder.query({
            query: () => {
                return {
                    url: "/categories/query",
                    method: "GET",

                }
            },
            providesTags: [TagTypes.brand]
        }),

        updateCategory: builder.mutation({
            query: ({ id, data }: { id: string, data: any }) => {
                return {
                    url: `/categories/${id}`,
                    method: "PATCH",
                    body: data
                }
            },
            invalidatesTags: [TagTypes.brand]
        }),
        deleteCaegory: builder.mutation({
            query: (id: string) => {
                return {
                    url: `/categories/${id}`,
                    method: "DELETE"
                }
            },
            invalidatesTags: [TagTypes.brand]
        }),


    }),
});

export const {
    useCreateNewCategoryMutation,
    useGetAllCategorysQuery,
    useUpdateCategoryMutation,
    useDeleteCaegoryMutation,
    useGetCategoryQuery
} = categoryApi;
