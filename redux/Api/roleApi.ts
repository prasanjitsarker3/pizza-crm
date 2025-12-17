import { TagTypes } from "@/types/tagTypes";
import { baseApi } from "../baseApi";


export const rolesApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        getAllRoles: builder.query({
            query: (args: any) => {
                return {
                    url: '/roles',
                    method: "GET",
                    params: args
                }
            },
            providesTags: [TagTypes.role]
        }),



    }),
});

export const {
    useGetAllRolesQuery
} = rolesApi;
