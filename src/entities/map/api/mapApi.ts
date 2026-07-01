import { baseApi } from "@/shared/api";
import {
  ICreateVisitRequest,
  IMapMarker,
  IMapPlaceVisits,
  IVisitCoupleAuthor,
  IVisitAuthor,
  IVisitsResponse,
  IUpdateVisitRequest,
} from "../model/type";

type VisitsApiResponse =
  | IMapMarker[]
  | IMapPlaceVisits[]
  | {
      visits?: IMapMarker[] | IMapPlaceVisits[];
      map?: IMapPlaceVisits[];
      data?: IMapMarker[] | IMapPlaceVisits[] | FollowingVisitsItem[];
      places?: IMapPlaceVisits[];
      items?: IMapMarker[] | IMapPlaceVisits[] | FollowingVisitsItem[];
    };

type FollowingVisitsItem = {
  id?: number | string;
  type?: string;
  username?: string;
  name?: string;
  avatarUrl?: string;
  authors?: IVisitAuthor[] | null;
  author?: IVisitAuthor | null;
  user?: IVisitAuthor | null;
  createdBy?: IVisitAuthor | null;
  creator?: IVisitAuthor | null;
  owner?: IVisitAuthor | null;
  couple?: IVisitCoupleAuthor | null;
  members?: IVisitCoupleAuthor["members"];
  generatedName?: string;
  visits?: IMapMarker[] | IMapPlaceVisits[];
  map?: IMapPlaceVisits[];
  places?: IMapPlaceVisits[];
};

type VisitMutationResponse =
  | IMapMarker
  | {
      data: IMapMarker;
    };

const unwrapVisitMutationResponse = (
  response: VisitMutationResponse,
): IMapMarker => ("data" in response ? response.data : response);

const isPlaceVisits = (
  item: IMapMarker | IMapPlaceVisits | FollowingVisitsItem,
): item is IMapPlaceVisits => "place" in item && Array.isArray(item.visits);

const isMapMarker = (
  item: IMapMarker | IMapPlaceVisits | FollowingVisitsItem,
): item is IMapMarker => "visitDate" in item && "title" in item;

const isVisitAuthor = (value: unknown): value is IVisitAuthor =>
  Boolean(
    value &&
    typeof value === "object" &&
    "username" in value &&
    typeof (value as { username?: unknown }).username === "string",
  );

const getMemberAuthor = (
  member: NonNullable<IVisitCoupleAuthor["members"]>[number],
): IVisitAuthor | null => {
  if (isVisitAuthor(member)) {
    return member;
  }

  return isVisitAuthor(member.user) ? member.user : null;
};

const getMemberAuthors = (
  members?: IVisitCoupleAuthor["members"],
): IVisitAuthor[] => members?.map(getMemberAuthor).filter(isVisitAuthor) ?? [];

const getItemAuthor = (item: FollowingVisitsItem): IVisitAuthor | undefined => {
  const directAuthor =
    item.author ?? item.user ?? item.createdBy ?? item.creator ?? item.owner;

  if (isVisitAuthor(directAuthor)) {
    return directAuthor;
  }

  if (item.type === "USER" && isVisitAuthor(item)) {
    return {
      id: item.id,
      username: item.username,
      name: item.name,
      avatarUrl: item.avatarUrl,
    };
  }

  return undefined;
};

const getItemAuthors = (item: FollowingVisitsItem): IVisitAuthor[] => {
  if (item.authors?.length) {
    return item.authors;
  }

  if (item.couple?.members?.length) {
    return getMemberAuthors(item.couple.members);
  }

  if (item.members?.length) {
    return getMemberAuthors(item.members);
  }

  const author = getItemAuthor(item);

  return author ? [author] : [];
};

const withAuthors = (
  visit: IMapMarker,
  authors: IVisitAuthor[],
  couple?: IVisitCoupleAuthor | null,
): IMapMarker => {
  if (!authors.length && !couple) {
    return visit;
  }

  return {
    ...visit,
    authors: visit.authors?.length ? visit.authors : authors,
    author: visit.author ?? authors[0],
    couple: visit.couple ?? couple,
  };
};

const normalizePlaceVisitsWithAuthor = (
  placeVisits: IMapPlaceVisits,
  authors: IVisitAuthor[],
  couple?: IVisitCoupleAuthor | null,
): IMapPlaceVisits => ({
  ...placeVisits,
  visits: placeVisits.visits.map((visit) =>
    withAuthors(visit, authors, couple),
  ),
});

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

const flattenFollowingItems = (
  items: FollowingVisitsItem[],
): (IMapMarker | IMapPlaceVisits)[] => {
  const flattened: (IMapMarker | IMapPlaceVisits)[] = [];

  items.forEach((item) => {
    const authors = getItemAuthors(item);
    const visits = item.map ?? item.places ?? item.visits;

    if (!visits) {
      return;
    }

    if (visits.every(isPlaceVisits)) {
      flattened.push(
        ...visits.map((placeVisits) =>
          normalizePlaceVisitsWithAuthor(placeVisits, authors, item.couple),
        ),
      );
      return;
    }

    flattened.push(
      ...(visits as IMapMarker[]).map((visit) =>
        withAuthors(visit, authors, item.couple),
      ),
    );
  });

  return flattened;
};

const normalizeVisitsResponse = (
  response: VisitsApiResponse,
): IVisitsResponse => {
  const normalizeVisitsArray = (
    visits: (IMapMarker | IMapPlaceVisits | FollowingVisitsItem)[],
  ): IVisitsResponse => {
    if (!visits.length) {
      return [];
    }

    if (visits.every(isPlaceVisits)) {
      return visits;
    }

    if (visits.every(isMapMarker)) {
      return groupFlatVisits(visits);
    }

    return normalizeVisitsArray(flattenFollowingItems(visits));
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
      invalidatesTags: [
        { type: "User", id: "VISITS" },
        { type: "Couple", id: "VISITS" },
        { type: "Feed", id: "LIST" },
      ],
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

    getFollowingVisits: build.query<IVisitsResponse, void>({
      query: () => "/users/me/following/visits",
      transformResponse: normalizeVisitsResponse,
      providesTags: [{ type: "User", id: "VISITS" }],
    }),

    updateVisit: build.mutation<
      IMapMarker,
      { visitId: string; body: IUpdateVisitRequest }
    >({
      query: ({ visitId, body }) => ({
        url: `/visits/${visitId}`,
        method: "PATCH",
        body,
      }),
      transformResponse: unwrapVisitMutationResponse,
      invalidatesTags: [
        { type: "User", id: "VISITS" },
        { type: "Couple", id: "VISITS" },
        { type: "Feed", id: "LIST" },
      ],
    }),

    deleteVisit: build.mutation<void, { visitId: string }>({
      query: ({ visitId }) => ({
        url: `/visits/${visitId}`,
        method: "DELETE",
      }),
      invalidatesTags: [
        { type: "User", id: "VISITS" },
        { type: "Couple", id: "VISITS" },
        { type: "Feed", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useCreateVisitMutation,
  useGetVisitsByUsernameQuery,
  useGetVisitsByCoupleIdQuery,
  useGetFollowingVisitsQuery,
  useUpdateVisitMutation,
  useDeleteVisitMutation,
} = mapApi;
