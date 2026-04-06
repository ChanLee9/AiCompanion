import React from "react";
import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Onboarding } from "./screens/Onboarding";
import { Chat } from "./screens/Chat";
import { SessionsScreen } from "./screens/Sessions";
import { MemoryScreen } from "./screens/Memory";
import { ProfileScreen } from "./screens/Profile";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Chat },
      { path: "onboarding", Component: Onboarding },
      { path: "sessions", Component: SessionsScreen },
      { path: "memory", Component: MemoryScreen },
      { path: "profile", Component: ProfileScreen },
    ],
  },
]);
