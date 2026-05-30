import { Outlet } from "react-router-dom";
import TabBar from "./components/TabBar/TabBar";

export default function MainLayout() {
  return (
    <>
      <Outlet />

      <TabBar />
    </>
  );
}
