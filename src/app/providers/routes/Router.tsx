import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { Login, Register } from "@/pages/auth";
import MainLayout from "../layouts/MainLayout";
import { Box, Flex } from "@mantine/core";
import Feed from "@/pages/feed";
import Error404 from "@/pages/errors";
import ClosedProfile from "@/pages/errors/ui/ClosedProfile/ClosedProfile";
import { AuthGuard } from "../guards/AuthGuard";
import Map from "@/pages/map";
import Profile from "@/pages/profile";
import Follows from "@/pages/follows";
import CoupleProfile from "@/pages/couple";
import Onboarding from "@/pages/onboarding";
import { OnboardingGuard } from "../guards/OnboardingGuard";
import { AdminGuard } from "../guards/AdminGuard";
import Admin from "@/pages/admin";
import Email from "@/pages/email";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <OnboardingGuard>
        <AuthGuard>
          <MainLayout />
        </AuthGuard>
      </OnboardingGuard>
    ),
    children: [
      {
        path: "/",
        element: <Feed />,
      },
      {
        path: "/admin",
        element: (
          <AdminGuard>
            <Admin />
          </AdminGuard>
        ),
      },
      {
        path: "/map",
        element: <Map />,
      },
      {
        path: "/profile/:username",
        element: <Profile />,
      },
      {
        path: "/couple/:id",
        element: <CoupleProfile />,
      },
      {
        path: "/profile/:username/:type",
        element: <Follows />,
      },
    ],
  },
  {
    path: "/onboarding",
    element: <Onboarding />,
  },
  {
    path: "/auth",
    element: <OnboardingGuard />,
    children: [
      {
        path: "/auth/login",
        element: <Login />,
      },
      {
        path: "/auth/register",
        element: <Register />,
      },
    ],
  },
  {
    path: "/confirm-email",
    element: <Email />,
  },
  {
    path: "/Email",
    element: <Email />,
  },
  {
    path: "/closed-profile",
    element: <ClosedProfile />,
  },
  {
    path: "/404",
    element: <Error404 />,
  },
  {
    path: "*",
    element: <Error404 />,
  },
]);

export function Router() {
  return (
    <Flex w={"100%"} justify={"center"}>
      <Box
        w={"100%"}
        maw={500}
        style={{
          display: "flex",
          flexDirection: "column",
          // borderLeft: "1px solid white",
          // borderRight: "1px solid white",
        }}
      >
        <RouterProvider router={router} />
      </Box>
    </Flex>
  );
}
