import { onboardingSteps } from "../model/onboardingSteps";
import { selectUser } from "@/entities/user";
import { useAppSelector } from "@/shared/lib";
import { completeIntroOnboarding } from "@/shared/utils";
import SpotButton from "@/shared/ui/SpotButton/SpotButton";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FriendsStep from "./components/FriendsStep";
import PartnerStep from "./components/PartnerStep";
import PlacesStep from "./components/PlacesStep";
import WelcomeStep from "./components/WelcomeStep";
import styles from "./Onboarding.module.css";

const stepVisuals = [
  <WelcomeStep key="welcome" />,
  <PlacesStep key="places" />,
  <PartnerStep key="partner" />,
  <FriendsStep key="friends" />,
];

export default function Onboarding() {
  const navigate = useNavigate();
  const user = useAppSelector(selectUser);
  const [activeStep, setActiveStep] = useState(0);
  const content = onboardingSteps[activeStep];
  const isLastStep = activeStep === onboardingSteps.length - 1;

  const finishIntroOnboarding = () => {
    completeIntroOnboarding();
    navigate(user.id ? "/" : "/auth/register");
  };

  const handleNext = () => {
    if (isLastStep) {
      finishIntroOnboarding();
      return;
    }

    setActiveStep((step) => step + 1);
  };

  return (
    <section className={styles.page}>
      <main className={styles.main}>
        <div
          className={`${styles.visualStage} ${
            activeStep > 0 ? styles.visualStageAfterWelcome : ""
          }`}
        >
          {stepVisuals[activeStep]}
        </div>

        <div className={styles.copy} key={content.id}>
          <h1 className={styles.title}>{content.title}</h1>
          <p className={styles.description}>{content.description}</p>
        </div>
      </main>

      <footer className={styles.footer}>
        <div className={styles.dots} aria-label="Шаги онбординга">
          {onboardingSteps.map((step, index) => (
            <button
              key={step.id}
              type="button"
              className={`${styles.dot} ${
                index === activeStep ? styles.dotActive : ""
              }`}
              aria-label={`Перейти к шагу ${index + 1}`}
              aria-current={index === activeStep ? "step" : undefined}
              onClick={() => setActiveStep(index)}
            />
          ))}
        </div>

        <SpotButton className={styles.nextButton} onClick={handleNext}>
          {isLastStep ? "Начать" : "Далее"}
        </SpotButton>

        <button
          type="button"
          className={styles.skip}
          onClick={finishIntroOnboarding}
        >
          Пропустить
        </button>
      </footer>
    </section>
  );
}
