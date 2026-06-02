import { Outlet } from "react-router-dom";
import TabBar from "./components/TabBar/TabBar";
import { selectView } from "@/entities/view";
import { useAppSelector } from "@/shared/lib";

export default function MainLayout() {
  const viewState = useAppSelector(selectView);
  return (
    <>
      <Outlet />
      {viewState.ui.mapIsFullScreen ? undefined : <TabBar />}
    </>
  );
}
