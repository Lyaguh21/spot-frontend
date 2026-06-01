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

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AuthGuard>
        <MainLayout />
      </AuthGuard>
    ),
    children: [
      {
        path: "/",
        element: <Feed />,
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
        path: "/profile/:username/:type",
        element: <Follows />,
      },
    ],
  },

  {
    path: "/auth",
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
