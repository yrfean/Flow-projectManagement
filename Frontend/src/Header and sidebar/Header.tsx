import {
  CalendarDays,
  MessageSquareWarning,
  Search,
} from "lucide-react";
import { useAllData } from "../Query/QueryAndMutation";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useNotificaions from "../CustomHooks.tsx/Notification";

const Header = () => {
  const { data } = useAllData();
  const [isAdmin, setIsAdmin] = useState(false);
  const { notification } = useNotificaions();

  const navigate = useNavigate();

  useEffect(() => {
    const item = sessionStorage.getItem("role");
    if (item === "admin") {
      setIsAdmin(true);
    }
  }, []);
  return (
    <div className="h-[10%] w-full flex items-center">
      <div className="h-full w-[22%] flex items-center justify-center">
        {/* logog left side */}
        <img
          src="./Flow_logo_211215.png"
          alt="flow logo"
          className="h-[30%] opacity-85"
        />
      </div>

      <div className="flex items-center h-full w-full outline outline-1 outline-gray-300">
        {/* right side */}
        

        <div className="flex items-center ml-auto mr-11 space-x-4 h-full">
          {/* cal,notif,profile */}
          <div className="flex items-center gap-5 mr-9">

            <div
              onClick={() => navigate("/messages")}
              className="text-gray-500 cursor-pointer group hover:text-violet-500 hover:scale-110 transition-all ease-in-out"
            >
              <div className="relative">
                {/* Notification Badge */}
                {notification?.length > 0 && (
                  <div className="absolute -top-1 -right-1 bg-violet-500 text-white text-[10px] px-1.5 py-[2px] rounded-full font-semibold min-w-[16px] text-center">
                    {notification?.length > 9 ? "9+" : notification?.length}
                  </div>
                )}
                {/* Icon */}
                <MessageSquareWarning className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="h-full flex space-x-3 items-center ml-24">
            <div className="w-30">
              <h1 className="text-xl text-right font-semibold leading-none tracking-wide">
                {data?.user?.name}
              </h1>
              <p className="text-gray-400 text-right text-sm -mt-1">
                {!isAdmin && !data?.user.location
                  ? "set ur  location in settings"
                  : data?.user?.location}
              </p>
            </div>
            <img
              src={!isAdmin && !data?.user.dp ? "./man.png" : data?.user.dp}
              alt="pfp"
              className="object-cover w-9 h-9 cursor-pointer hover:shadow-md rounded-full duration-150 hover:scale-110 transition-all ease-in"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
