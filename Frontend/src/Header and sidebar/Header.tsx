import {
  BellDot,
  CalendarDays,
  MessageSquareWarning,
  Search,
} from "lucide-react";
import { useAllData } from "../Query/QueryAndMutation";

const Header = () => {
  const { data } = useAllData();
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
        <div className="h-full flex items-center">
          {/* search and evrytng */}
          <div className="h-full relative flex items-center ml-5">
            <div className="absolute ml-3 text-gray-400">
              <Search />
            </div>
            <input
              type="text"
              className="h-9 pl-11 rounded w-80 shadow-sm focus:outline-none focus:shadow-md "
              placeholder="Search for anything..."
            />
          </div>
        </div>

        <div className="flex items-center ml-auto mr-11 space-x-4 h-full">
          {/* cal,notif,profile */}
          <div className="flex items-center gap-5 mr-9">
            <div className="text-gray-500 cursor-pointer hover:text-violet-500 hover:scale-110 transition-all ease-in-out">
              <CalendarDays />
            </div>

            <div className="text-gray-500 cursor-pointer hover:text-violet-500 hover:scale-110 transition-all ease-in-out">
              <MessageSquareWarning />
            </div>

            <div className="text-gray-500 cursor-pointer hover:text-violet-500 hover:scale-110 transition-all ease-in-out">
              <BellDot />
            </div>
          </div>

          <div className="h-full flex space-x-3 items-center ml-24">
            <div className="w-30">
              <h1 className="font-normal text-xl leading-none tracking-wide">
                {data?.user?.name}
              </h1>
              <p className="text-gray-400 text-right text-sm -mt-1">
                {data?.user?.location || ""}
              </p>
            </div>
            <img
              src={data?.user?.dp}
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
