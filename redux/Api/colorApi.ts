import { TagTypes } from "@/types/tagTypes";
import { baseApi } from "../baseApi";

export const colorApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createColor: builder.mutation({
            query: (data: any) => {
                return {
                    url: "/colors",
                    method: "POST",
                    body: data
                }
            },
            invalidatesTags: [TagTypes.color]
        }),
        getColors: builder.query({
            query: (args: any) => {
                return {
                    url: '/colors',
                    method: "GET",
                    params: args
                }
            },
            providesTags: [TagTypes.color]
        }),

        deleteColor: builder.mutation({
            query: (id: string) => {
                return {
                    url: `/colors/${id}`,
                    method: "DELETE"
                }
            },
            invalidatesTags: [TagTypes.color]
        }),
        updateColor: builder.mutation({
            query: ({ id, data }: { id: string, data: any }) => {
                return {
                    url: `/colors/${id}`,
                    method: "PATCH",
                    body: data
                }
            },
            invalidatesTags: [TagTypes.color]
        })

    }),
});

export const {
    useGetColorsQuery,
    useCreateColorMutation,
    useDeleteColorMutation,
    useUpdateColorMutation,
    useLazyGetColorsQuery
} = colorApi;
