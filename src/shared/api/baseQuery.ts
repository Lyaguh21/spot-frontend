import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { Capacitor } from "@capacitor/core";
import { userLogout } from "@/entities/user/model/userSlice";

const getRuntimeWebBaseUrl = () => {
  if (typeof window === "undefined") {
    return "http://localhost:3000";
  }

  return `${window.location.protocol}//${window.location.hostname}:3000`;
};

const getWebApiBaseUrl = () => {
  const configuredApiUrl = import.meta.env.VITE_API_URL;

  if (import.meta.env.DEV) {
    return configuredApiUrl && configuredApiUrl !== "/api"
      ? configuredApiUrl
      : getRuntimeWebBaseUrl();
  }

  return configuredApiUrl ?? "/api";
};

const getApiBaseUrl = () => {
  if (Capacitor.isNativePlatform()) {
    const mobileApiUrl = import.meta.env.VITE_MOBILE_API_URL;

    if (!mobileApiUrl) {
      throw new Error(
        "VITE_MOBILE_API_URL is required for Capacitor builds. Example: https://api.example.com",
      );
    }

    return mobileApiUrl;
  }

  return getWebApiBaseUrl();
};

const baseQuery = fetchBaseQuery({
  baseUrl: getApiBaseUrl(),
  credentials: "include",
});

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // если это refresh → не пытаемся обновлять токен
    if (typeof args === "string" && args.includes("/auth/refresh")) {
      api.dispatch(userLogout());
      return result;
    }

    if (typeof args !== "string" && args.url.includes("/auth/refresh")) {
      api.dispatch(userLogout());
      return result;
    }

    // пробуем refresh
    const refreshResult = await baseQuery(
      {
        url: "/auth/refresh",
        method: "POST",
      },
      api,
      extraOptions,
    );

    if (refreshResult.data) {
      // повторяем исходный запрос
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(userLogout());
    }
  }

  if (
    //@ts-ignore
    result.error?.data?.details?.message === "Почта не подтверждена" &&
    result.error?.status === 403
  ) {
    window.location.replace("/confirm-email");
  }

  if (
    //@ts-ignore
    result.error?.data?.details?.code === "USER_BANNED"
  ) {
    window.location.replace("/banned");
  }

  return result;
};
