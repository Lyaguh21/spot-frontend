import { useStatusQuery } from "@/entities/auth";
import { setUser, userLogout } from "@/entities/user";
import { useAppDispatch, useAppSelector } from "@/shared/lib";
import { getAuthRedirectPath } from "@/shared/utils";
import { LoadingOverlay } from "@mantine/core";
import { useEffect, useRef } from "react";
import { Navigate, matchPath, useLocation } from "react-router-dom";

const PUBLIC_ROUTES = [
  "/auth/login",
  "/auth/register",
  "/profile/:username",
  "/couple/:id",
];

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const userId = useAppSelector((state) => state.user.id);
  const { data, isLoading, isError, isUninitialized } = useStatusQuery(
    undefined,
    { refetchOnMountOrArgChange: true },
  );
  const lastAuthUsernameRef = useRef<string | null>(null);

  const isPublicRoute = PUBLIC_ROUTES.some((pattern) =>
    matchPath({ path: pattern, end: false }, location.pathname),
  );
  const profileMatch = matchPath(
    { path: "/profile/:username", end: false },
    location.pathname,
  );
  const coupleMatch = matchPath(
    { path: "/couple/:id", end: false },
    location.pathname,
  );
  const shouldResolveViewerIdentity = Boolean(profileMatch || coupleMatch);

  useEffect(() => {
    if (data?.authenticated) {
      dispatch(setUser(data.user));
      lastAuthUsernameRef.current = data.user.username ?? null;
    }

    if (data && !data.authenticated) {
      dispatch(userLogout());
    }
  }, [data]);

  if (!isPublicRoute && !userId && (isLoading || isUninitialized)) {
    return <LoadingOverlay visible pos="fixed" />;
  }

  if (
    shouldResolveViewerIdentity &&
    !userId &&
    (isLoading || isUninitialized || data?.authenticated)
  ) {
    return <LoadingOverlay visible pos="fixed" />;
  }

  if (!isPublicRoute && !userId && (isError || !data?.authenticated)) {
    return (
      <Navigate to={getAuthRedirectPath()} replace state={{ from: location }} />
    );
  }

  if (
    profileMatch?.params?.username &&
    profileMatch.params.username === lastAuthUsernameRef.current &&
    (isError || data?.authenticated === false)
  ) {
    return (
      <Navigate to={getAuthRedirectPath()} replace state={{ from: location }} />
    );
  }

  return <>{children}</>;
};
