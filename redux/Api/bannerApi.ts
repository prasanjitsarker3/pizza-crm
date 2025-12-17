import { TagTypes } from "@/types/tagTypes";
import { baseApi } from "../baseApi";

export const bannerApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createBanner: builder.mutation({
            query: (data) => {
                return {
                    url: `/banner`,
                    method: "POST",
                    body: data,
                };
            },
            invalidatesTags: [TagTypes.banner]
        }),
        getAllBanners: builder.query({
            query: (args: any) => {
                return {
                    url: "/banner",
                    method: "GET",
                    params: args
                }
            },
            providesTags: [TagTypes.banner]
        }),

        updateBanner: builder.mutation({
            query: ({ id, data }: { id: string, data: any }) => {
                return {
                    url: `/banner/${id}`,
                    method: "PATCH",
                    body: data
                }
            },
            invalidatesTags: [TagTypes.banner]
        }),
        deleteBanner: builder.mutation({
            query: (id: string) => {
                return {
                    url: `/banner/${id}`,
                    method: "DELETE"
                }
            },
            invalidatesTags: [TagTypes.banner]
        }),
        bannerPublishing: builder.mutation({
            query: ({ id, active }: { id: string, active: boolean }) => {
                return {
                    url: `/banner/publish/${id}`,
                    method: "PATCH",
                    body: { active: Boolean(active) },
                }
            },
            invalidatesTags: [TagTypes.banner]
        })
        ,
        getAllAudience: builder.query({
            query: (args: any) => {
                console.log(args)
                return {
                    url: "/banner/audience",
                    method: "GET",
                    params: args
                }
            }
        })


    }),
});

export const {
    useCreateBannerMutation,
    useGetAllBannersQuery,
    useUpdateBannerMutation,
    useDeleteBannerMutation,
    useBannerPublishingMutation,
    useGetAllAudienceQuery,
    useLazyGetAllAudienceQuery,
} = bannerApi;
