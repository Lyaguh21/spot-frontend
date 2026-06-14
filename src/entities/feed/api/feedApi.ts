import { baseApi } from "@/shared/api";
import { IFeedItem } from "../model/type";

export const feedApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getFeed: build.query<IFeedItem[], void>({
      query: () => "/feed",
      providesTags: [{ type: "Feed", id: "LIST" }],
    }),
  }),
});

export const { useGetFeedQuery } = feedApi;
