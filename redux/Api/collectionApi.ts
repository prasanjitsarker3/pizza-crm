import { TagTypes } from "@/types/tagTypes";
import { baseApi } from "../baseApi";
import { boolean } from "zod";

export const collectionApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createCollection: builder.mutation({
            query: (data) => {
                return {
                    url: `/collections`,
                    method: "POST",
                    body: data,
                };
            },
            invalidatesTags: [TagTypes.collection]
        }),
        getAllCollections: builder.query({
            query: (args: any) => {
                return {
                    url: "/collections",
                    method: "GET",
                    params: args
                }
            },
            providesTags: [TagTypes.collection]
        }),

        updateCollection: builder.mutation({
            query: ({ id, data }: { id: string, data: any }) => {
                return {
                    url: `/collections/${id}`,
                    method: "PATCH",
                    body: data
                }
            },
            invalidatesTags: [TagTypes.collection]
        }),
        deleteCollection: builder.mutation({
            query: (id: string) => {
                return {
                    url: `/collections/${id}`,
                    method: "DELETE"
                }
            },
            invalidatesTags: [TagTypes.collection]
        }),
        displayPublishing: builder.mutation({
            query: ({ id, isDisplay }: { id: string, isDisplay: boolean }) => {
                return {
                    url: `/collections/display/${id}`,
                    method: "PATCH",
                    body: { isDisplay: Boolean(isDisplay) },
                }
            },
            invalidatesTags: [TagTypes.collection]
        }),


        createSunCategory: builder.mutation({
            query: (data: any) => {
                return {
                    url: `/collections/subcategory`,
                    method: "POST",
                    body: data
                }
            },
            invalidatesTags: [TagTypes.collection]
        }),


        getAllSubCategories: builder.query({
            query: (args: any) => {
                return {
                    url: `/collections/subcategory`,
                    method: "GET",
                    params: args
                }
            },
            providesTags: [TagTypes.subCategories]
        }),

        updateSubCategory: builder.mutation({
            query: ({ id, data }: { id: string, data: any }) => {
                return {
                    url: `/collections/subcategory/${id}`,
                    method: "PATCH",
                    body: data
                }
            },
            invalidatesTags: [TagTypes.subCategories]
        }),
        deleteSubCategory: builder.mutation({
            query: (id: string) => {
                return {
                    url: `/collections/subcategory/${id}`,
                    method: "DELETE",
                }
            },
            invalidatesTags: [TagTypes.subCategories]
        })

    }),
});

export const {
    useCreateCollectionMutation,
    useGetAllCollectionsQuery,
    useUpdateCollectionMutation,
    useDeleteCollectionMutation,
    useDisplayPublishingMutation,
    useCreateSunCategoryMutation,
    useGetAllSubCategoriesQuery,
    useUpdateSubCategoryMutation,
    useDeleteSubCategoryMutation,

    useLazyGetAllCollectionsQuery,
    useLazyGetAllSubCategoriesQuery,
} = collectionApi;
