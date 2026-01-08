import { TagTypes } from "@/types/tagTypes";
import { baseApi } from "../baseApi";


export const commonApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAnalysis: builder.query({
            query: () => {
                return {
                    url: '/analysis/admin',
                    method: "GET",

                }
            },
        }),
    }),
});

export const {
    useGetAnalysisQuery

} = commonApi;
