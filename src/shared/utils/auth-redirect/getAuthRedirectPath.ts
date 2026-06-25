import { isIntroOnboardingCompleted } from "../onboarding/onboardingStorage";

export const getAuthRedirectPath = () =>
  isIntroOnboardingCompleted() ? "/auth/login" : "/onboarding";
