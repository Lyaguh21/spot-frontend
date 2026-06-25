import { Navigate, Outlet } from "react-router-dom";
import { isIntroOnboardingCompleted } from "@/shared/utils";

export function OnboardingGuard({ children }: { children?: React.ReactNode }) {
  if (!isIntroOnboardingCompleted()) {
    return <Navigate to="/onboarding" replace />;
  }

  if (children) return <>{children}</>;
  return <Outlet />;
}
