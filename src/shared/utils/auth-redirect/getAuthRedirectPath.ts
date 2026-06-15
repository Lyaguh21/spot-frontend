export const getAuthRedirectPath = () =>
  localStorage.getItem("onboardingCompleted") === "true"
    ? "/auth/login"
    : "/onboarding";
