import { baseApi } from "@/shared/api";
import {
  ICreateVisitRequest,
  IMapMarker,
  IMapPlaceVisits,
  IVisitsResponse,
} from "../model/type";

type VisitsApiResponse =
  | IMapMarker[]
  | IMapPlaceVisits[]
  | {
      visits?: IMapMarker[] | IMapPlaceVisits[];
      map?: IMapPlaceVisits[];
      data?: IMapMarker[] | IMapPlaceVisits[];
      places?: IMapPlaceVisits[];
      items?: IMapMarker[] | IMapPlaceVisits[];
    };

const isPlaceVisits = (
  item: IMapMarker | IMapPlaceVisits,
): item is IMapPlaceVisits => "place" in item && Array.isArray(item.visits);

const groupFlatVisits = (visits: IMapMarker[]): IVisitsResponse => {
  const groups = new Map<string, IMapPlaceVisits>();

  visits.forEach((visit) => {
    const lat = visit.lat ?? 0;
    const lng = visit.lng ?? 0;
    const key =
      visit.externalId ?? `${lat.toFixed(6)}:${lng.toFixed(6)}:${visit.title}`;
    const group = groups.get(key);

    if (group) {
      group.visits.push(visit);
      return;
    }

    groups.set(key, {
      place: {
        title: visit.title,
        lat,
        lng,
      },
      visits: [visit],
    });
  });

  return Array.from(groups.values());
};

const normalizeVisitsResponse = (
  response: VisitsApiResponse,
): IVisitsResponse => {
  const normalizeVisitsArray = (
    visits: IMapMarker[] | IMapPlaceVisits[],
  ): IVisitsResponse => {
    if (visits.every(isPlaceVisits)) {
      return visits;
    }

    return groupFlatVisits(visits as IMapMarker[]);
  };

  if (Array.isArray(response)) {
    return normalizeVisitsArray(response);
  }

  if (response.map) {
    return response.map;
  }

  if (response.places) {
    return response.places;
  }

  return normalizeVisitsArray(
    response.visits ?? response.data ?? response.items ?? [],
  );
};

export const mapApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createVisit: build.mutation<void, { body: ICreateVisitRequest }>({
      query: ({ body }) => ({
        url: "/visits",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "User", id: "VISITS" }],
    }),

    getVisitsByUsername: build.query<IVisitsResponse, { username: string }>({
      query: ({ username }) => `/users/${username}/visits`,
      transformResponse: normalizeVisitsResponse,
      providesTags: [{ type: "User", id: "VISITS" }],
    }),

    getVisitsByCoupleId: build.query<IVisitsResponse, { coupleId: string }>({
      query: ({ coupleId }) => `/couples/${coupleId}/visits`,
      transformResponse: normalizeVisitsResponse,
      providesTags: [{ type: "Couple", id: "VISITS" }],
    }),
  }),
});

export const {
  useCreateVisitMutation,
  useGetVisitsByUsernameQuery,
  useGetVisitsByCoupleIdQuery,
} = mapApi;
