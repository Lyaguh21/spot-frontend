import { selectUser } from "@/entities/user";
import { useAppSelector } from "@/shared/lib";
import { Navigate } from "react-router-dom";

export function BannedGuard({ children }: { children?: React.ReactNode }) {
  const user = useAppSelector(selectUser);

  if (user.isBanned && user.id) {
    return <Navigate to="/banned" replace />;
  }
  return <>{children}</>;
}
