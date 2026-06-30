import { selectUser } from "@/entities/user";
import { useAppSelector } from "@/shared/lib";
import { Navigate, matchPath, useLocation } from "react-router-dom";

const EMAIL_CONFIRM_ROUTE = "/confirm-email";

export function EmailConfirmGuard({
  children,
}: {
  children?: React.ReactNode;
}) {
  const user = useAppSelector(selectUser);
  const location = useLocation();

  const isEmailConfirmRoute = Boolean(
    matchPath({ path: EMAIL_CONFIRM_ROUTE, end: true }, location.pathname),
  );

  if (!user.isEmailVerified && user.id && !isEmailConfirmRoute) {
    return <Navigate to={EMAIL_CONFIRM_ROUTE} replace />;
  }
  return <>{children}</>;
}
