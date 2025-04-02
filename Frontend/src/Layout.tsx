import { Outlet } from "react-router-dom";
import Header from "./Header and sidebar/Header";
import Sidebar from "./Header and sidebar/Sidebar";

const Layout = () => {
  return (
    <>
      <div className="w-screen h-screen bg-gray-200 overflow-x-hidden overflow-y-hidden">
        <Header />
        <div className="flex h-[90%]">
          <Sidebar />
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default Layout;
