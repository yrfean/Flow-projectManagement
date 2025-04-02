import { useAllData } from "../Query/QueryAndMutation";

const ChatList = ({ setClickedUser }: any) => {
  const { data } = useAllData();

  // removing userself
  const user = data?.allUsers?.filter(
    (user: any) => user._id !== data.user._id
  );
  return (
    <>
      <div className="w-[30%] h-full border-r-2 border-r-gray-300">
        <h1 className="text-4xl font-bold font-serif pt-5 mb-3 ml-6 text-violet-500">
          Messages
        </h1>
        <div className="w-[90%] ml-4 h-1 bg-gray-300" />
        {/* users list container*/}
        <div className="w-full p-2">
          {user?.map((user: any) => {
            return (
              <div
                key={user._id}
                onClick={() => setClickedUser(user)}
                className="w-full h-fit bg-gray-300 flex py-3 my-2 cursor-pointer hover:shadow hover:scale-105 transition-all duration-300 gap-4 pl-4 outline-1 outlin rounded-lg"
              >
                <img
                  src={user.dp}
                  alt="user dp"
                  className="w-8 h-8 object-cover rounded-full"
                />
                <h1 className="text-base font-semibold">{user.name}</h1>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default ChatList;
