import { createBrowserRouter } from "react-router-dom";
import Layout from "./Layout";
import Messages from "./Pages/Global Pages/Messages";
import Settings from "./Pages/Global Pages/Settings";
import Login from "./Login/Login";
import AdminHome from "./Pages/Admin Pages/AdminHome";
import Members from "./Pages/Admin Pages/Members";
import Home from "./Pages/Home";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/admin", element: <AdminHome /> },
      { path: "/home", element: <Home /> },
      { path: "/settings", element: <Settings /> },
      { path: "/messages", element: <Messages /> },
    ],
  },

  {
    path: "/members", //Only for admin
    element: <Members />,
  },
  {
    path: "/settings",
    element: <Settings />,
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

export { router };
