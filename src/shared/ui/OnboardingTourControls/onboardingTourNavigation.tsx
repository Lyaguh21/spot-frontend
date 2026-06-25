import { Button, Group, Stack } from "@mantine/core";
import type {
  OnboardingTourController,
  OnboardingTourProps,
} from "@gfazioli/mantine-onboarding-tour";
import styles from "./OnboardingTourControls.module.css";

type OnboardingTourNavigationProps = Pick<
  OnboardingTourProps,
  | "withStepper"
  | "withSkipButton"
  | "withNextButton"
  | "withPrevButton"
  | "footer"
>;

const renderNavigationFooter = (tourController: OnboardingTourController) => {
  const currentStepIndex = tourController.currentStepIndex ?? 0;
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === tourController.tour.length - 1;

  return (
    <Stack className={styles.footer}>
      <Group className={styles.controls} gap="xs" wrap="nowrap">
        {!isFirstStep && (
          <Button
            className={styles.navButton}
            variant="subtle"
            onClick={tourController.prevStep}
          >
            Назад
          </Button>
        )}

        <Button
          className={`${styles.navButton} ${styles.primaryButton}`}
          variant="subtle"
          onClick={tourController.nextStep}
        >
          {isLastStep ? "Готово" : "Далее"}
        </Button>
      </Group>

      <Button
        className={styles.skipButton}
        variant="subtle"
        onClick={tourController.skipTour}
      >
        Пропустить
      </Button>
    </Stack>
  );
};

export const onboardingTourNavigationProps = {
  withStepper: false,
  withSkipButton: false,
  withNextButton: false,
  withPrevButton: false,
  footer: renderNavigationFooter,
} satisfies OnboardingTourNavigationProps;
