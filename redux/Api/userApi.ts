import { TagTypes } from "@/types/tagTypes";
import { baseApi } from "../baseApi";

export const userApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllUsers: builder.query({
            query: (args: any) => {
                return {
                    url: "/users",
                    method: "GET",
                    params: args
                }
            },
            providesTags: [TagTypes.user]
        }),
        getSingleUser: builder.query({
            query: (id: string) => {
                return {
                    url: `/users/${id}`,
                    method: "GET",
                }
            },
            providesTags: [TagTypes.user]
        })
        ,
        createUser: builder.mutation({
            query: (data: any) => {
                return {
                    url: "/users",
                    method: "POST",
                    body: data
                }
            },
            invalidatesTags: [TagTypes.user]
        }),
        deleteUser: builder.mutation({
            query: (id: string) => {
                return {
                    url: `/users/${id}`,
                    method: "DELETE",
                }
            },
            invalidatesTags: [TagTypes.user]
        }),
        getUser: builder.query({
            query: () => {
                return {
                    url: `/auth/refresh/user`,
                    method: "GET"
                }
            },
            providesTags: [TagTypes.user]
        }),
        myProfile: builder.query({
            query: () => {
                return {
                    url: `/users/get/me`,
                    method: "GET"
                }
            },
            providesTags: [TagTypes.user]

        })

    }),
});

export const {
    useGetAllUsersQuery,
    useGetSingleUserQuery,
    useCreateUserMutation,
    useDeleteUserMutation,
    useGetUserQuery,
    useMyProfileQuery
} = userApi;
