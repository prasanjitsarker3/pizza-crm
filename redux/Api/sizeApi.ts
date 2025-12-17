import { TagTypes } from "@/types/tagTypes";
import { baseApi } from "../baseApi";


export const sizeApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createSize: builder.mutation({
            query: (data: any) => {
                return {
                    url: "/sizes",
                    method: "POST",
                    body: data
                }
            },
            invalidatesTags: [TagTypes.size]
        }),
        getAllSizes: builder.query({
            query: (args: any) => {
                return {
                    url: '/sizes',
                    method: "GET",
                    params: args
                }
            },
            providesTags: [TagTypes.size]
        }),

        updateSize: builder.mutation({
            query: ({ id, data }: { id: string, data: any }) => {
                return {
                    url: `/sizes/${id}`,
                    method: "PATCH",
                    body: data
                }
            },
            invalidatesTags: [TagTypes.size]
        }),
        deleteSize: builder.mutation({
            query: (id: string) => {
                return {
                    url: `/sizes/${id}`,
                    method: "DELETE"
                }
            },
            invalidatesTags: [TagTypes.size]
        })

    }),
});

export const {
    useGetAllSizesQuery,
    useLazyGetAllSizesQuery,
    useCreateSizeMutation,
    useDeleteSizeMutation,
    useUpdateSizeMutation
} = sizeApi;
