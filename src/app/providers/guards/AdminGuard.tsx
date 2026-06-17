import { selectUser } from "@/entities/user";
import { useAppSelector } from "@/shared/lib";
import { Navigate } from "react-router-dom";

export function AdminGuard({ children }: { children?: React.ReactNode }) {
  const user = useAppSelector(selectUser);
  const isAdmin = user.role === "ADMIN";

  if (!isAdmin && user.id) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}
