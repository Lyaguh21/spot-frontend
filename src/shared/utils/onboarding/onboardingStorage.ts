const COMPLETED_VALUE = "true";

export const ONBOARDING_STORAGE_KEYS = {
  intro: "onboardingCompleted",
  features: "featuresOnboardingCompleted",
} as const;

export const isIntroOnboardingCompleted = () =>
  localStorage.getItem(ONBOARDING_STORAGE_KEYS.intro) === COMPLETED_VALUE;

export const isFeaturesOnboardingCompleted = () =>
  localStorage.getItem(ONBOARDING_STORAGE_KEYS.features) === COMPLETED_VALUE;

export const completeIntroOnboarding = () => {
  localStorage.setItem(ONBOARDING_STORAGE_KEYS.intro, COMPLETED_VALUE);
};

export const completeFeaturesOnboarding = () => {
  localStorage.setItem(ONBOARDING_STORAGE_KEYS.features, COMPLETED_VALUE);
};

export const resetAllOnboardings = () => {
  Object.values(ONBOARDING_STORAGE_KEYS).forEach((key) => {
    localStorage.removeItem(key);
  });
};
