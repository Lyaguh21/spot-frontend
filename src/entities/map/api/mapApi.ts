import { baseApi } from "@/shared/api";
import { ICreateVisitRequest } from "../model/type";

export const mapApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createVisit: build.mutation<void, { body: ICreateVisitRequest }>({
      query: ({ body }) => ({
        url: "/visits",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useCreateVisitMutation } = mapApi;
