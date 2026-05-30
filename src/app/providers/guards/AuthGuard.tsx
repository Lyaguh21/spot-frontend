import { useStatusQuery } from "@/entities/auth";
import { setUser, userLogout } from "@/entities/user";

import { useAppDispatch, useAppSelector } from "@/shared/lib";
import { LoadingOverlay } from "@mantine/core";
import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const userId = useAppSelector((state) => state.user.id);
  const { data, isLoading, isError, isUninitialized } = useStatusQuery(
    undefined,
    { skip: Boolean(userId) },
  );

  useEffect(() => {
    if (data?.authenticated) {
      dispatch(setUser(data.user));
    }

    if (data && !data.authenticated) {
      dispatch(userLogout());
    }
  }, [data]);

  if (!userId && (isLoading || isUninitialized)) {
    return <LoadingOverlay visible pos="fixed" />;
  }

  if (!userId && (isError || !data?.authenticated)) {
    return <Navigate to="/auth/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
};
