import { useEffect, useState } from "react";
import { socket } from "../../socket";
import ChatList from "../../Components/ChatList";
import ChatArea from "../../Components/ChatArea";
import { useAllData } from "../../Query/QueryAndMutation";

const Messages = () => {
  const { data } = useAllData();
  const [clickedUser, setClickeduser] = useState();
  const getClickedUserFromList = (user: any) => {
    setClickeduser(user);
  };

  useEffect(() => {
    socket.on("connect", () => {
      console.log("user connected");
    });

    if (data?.user) {
      socket.emit("userConnected", data.user._id);
    }
    socket.on("connect_error", (err) => {
      console.log(err);
    });

    socket.on("disconnect", () => {
      console.log("disconnected");
    });
    if (!socket.connected) {
      socket.connect();
    }

    return () => {
      socket.disconnect();
    };
  }, [data]);
  
  return (
    <>
      <div className="w-[82.1%] h-full flex">
        <ChatList setClickedUser={getClickedUserFromList} />
        <ChatArea user={clickedUser || null} />
      </div>
    </>
  );
};

export default Messages;
