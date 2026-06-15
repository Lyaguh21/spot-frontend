import { Navigate, Outlet } from "react-router-dom";

export function OnboardingGuard({ children }: { children?: React.ReactNode }) {
  if (localStorage.getItem("onboardingCompleted") !== "true") {
    return <Navigate to="/onboarding" replace />;
  }

  if (children) return <>{children}</>;
  return <Outlet />;
}
