import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
  { path: "/", lazy: () => import("./App") },
  { path: "/about", lazy: () => import("./About") },
]);
