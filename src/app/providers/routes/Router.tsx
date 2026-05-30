import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { Login, Register } from "@/pages/auth";
import MainLayout from "../layouts/MainLayout";
import { Box, Flex } from "@mantine/core";
import Feed from "@/pages/feed";
import Error404 from "@/pages/errors";
import { AuthGuard } from "../guards/AuthGuard";
import Map from "@/pages/Map";
import Profile from "@/pages/Profile";

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
        path: "/profile",
        element: <Profile />,
      },
    ],
  },
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/profile/:username",
        element: <Profile />,
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
    path: "*",
    element: <Error404 />,
  },
]);

export function Router() {
  return (
    <Flex w={"100%"} mih={"100vh"} justify={"center"}>
      <Box
        maw={500}
        style={{
          borderLeft: "1px solid white",
          borderRight: "1px solid white",
        }}
      >
        <RouterProvider router={router} />
      </Box>
    </Flex>
  );
}
