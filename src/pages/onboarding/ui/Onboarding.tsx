import { onboardingSteps } from "../model/onboardingSteps";
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
  const [activeStep, setActiveStep] = useState(0);
  const content = onboardingSteps[activeStep];
  const isLastStep = activeStep === onboardingSteps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      localStorage.setItem("onboardingCompleted", "true");
      navigate("/auth/login");

      return;
    }

    setActiveStep((step) => step + 1);
  };

  const handleSkip = () => {
    localStorage.setItem("onboardingCompleted", "true");
    navigate("/auth/login");
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

        <button type="button" className={styles.skip} onClick={handleSkip}>
          Пропустить
        </button>
      </footer>
    </section>
  );
}
