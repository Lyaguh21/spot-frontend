import { Outlet } from "react-router-dom";

import { selectView } from "@/entities/view";
import { useAppSelector } from "@/shared/lib";

import PwaInstallPrompt from "@/widgets/pwa";
import TabBar from "./components/TabBar/TabBar";
import AppOnboardingTour from "../onboarding/AppOnboardingTour";

export default function MainLayout() {
  const viewState = useAppSelector(selectView);
  return (
    <AppOnboardingTour>
      <Outlet />
      {viewState.ui.mapIsFullScreen ? undefined : <TabBar />}
      <PwaInstallPrompt />
    </AppOnboardingTour>
  );
}
