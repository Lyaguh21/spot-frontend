import { useStatusQuery } from "@/entities/auth";
import { setUser, userLogout } from "@/entities/user";

import { useAppDispatch, useAppSelector } from "@/shared/lib";
import { LoadingOverlay } from "@mantine/core";
import { useEffect } from "react";
import { Navigate, matchPath, useLocation } from "react-router-dom";

const PUBLIC_ROUTES = ["/auth/login", "/auth/register", "/profile/:username"];

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const userId = useAppSelector((state) => state.user.id);
  const { data, isLoading, isError, isUninitialized } = useStatusQuery();

  const isPublicRoute = PUBLIC_ROUTES.some((pattern) =>
    matchPath({ path: pattern, end: false }, location.pathname),
  );

  useEffect(() => {
    if (data?.authenticated) {
      dispatch(setUser(data.user));
    }

    if (data && !data.authenticated) {
      dispatch(userLogout());
    }
  }, [data]);

  if (!isPublicRoute && !userId && (isLoading || isUninitialized)) {
    return <LoadingOverlay visible pos="fixed" />;
  }

  if (!isPublicRoute && !userId && (isError || !data?.authenticated)) {
    return <Navigate to="/auth/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
};
