import { CheckCheck, Send, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { socket } from "../socket";
import { useAllData } from "../Query/QueryAndMutation";
import axios from "axios";

const backendUri = import.meta.env.VITE_BACKEND_PORT;

interface Message {
  _id: string;
  senderId: string;
  recieverId: string;
  message: string;
  seen?: boolean;
}

const ChatArea = ({
  user,
}: {
  user: { _id: string; dp: string; name: string } | null;
}) => {
  const { data } = useAllData();
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const currentUserId = data?.user?._id;

  useEffect(() => {
    if (!user || !currentUserId) return;

    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `${backendUri}/getMessages/${currentUserId}/${user._id}`
        );
        setMessages(response.data.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();

    socket.on("recieveMessage", (newMessage: Message) => {
      setMessages((prev) => [...prev, newMessage]);

      // Emit `markAsSeen` if message is from the current chat user
      if (newMessage.senderId === user._id) {
        socket.emit("markAsSeen", {
          senderId: newMessage.senderId,
          recieverId: currentUserId,
        });
      }
    });

    socket.on("messageDeleted", (deletedMessageId: string) => {
      setMessages((prev) => prev.filter((msg) => msg._id !== deletedMessageId));
    });

    socket.on("messageSeen", ({ senderId, recieverId }) => {
      if (senderId === currentUserId || recieverId === currentUserId) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.senderId === senderId && msg.recieverId === recieverId
              ? { ...msg, seen: true }
              : msg
          )
        );
      }
    });

    return () => {
      socket.off("recieveMessage");
      socket.off("messageDeleted");
      socket.off("messageSeen");
    };
  }, [user, currentUserId]);

  // Emit `markAsSeen` when user opens the chat if messages are unread
  useEffect(() => {
    if (!user || !currentUserId) return;

    const unreadMessages = messages.some(
      (msg) => msg.senderId === user._id && !msg.seen
    );

    if (unreadMessages) {
      socket.emit("markAsSeen", {
        senderId: user._id,
        recieverId: currentUserId,
      });
    }
  }, [messages, user, currentUserId]);

  const handleSendMessage = () => {
    if (!text.trim() || !currentUserId || !user?._id) return;

    const messageData = {
      senderId: currentUserId,
      message: text,
      recieverId: user._id,
    };

    socket.emit("sendMessage", messageData);
    setMessages((prev) => [
      ...prev,
      { ...messageData, _id: Math.random().toString(), seen: false },
    ]);
    setText("");
  };

  const handleDeleteMessage = async (messageId: string) => {
    try {
      await axios.delete(`${backendUri}/deleteMessage/${messageId}`);
      socket.emit("deleteMessage", messageId);
      setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  return (
    <div className="w-[70%] relative mt-1 bg-gray-200">
      {user ? (
        <>
          {/* Messages */}
          <div className="bg-white h-[78%] w-full p-4 flex flex-col gap-2 overflow-y-auto">
            {messages.map((message) => {
              const isSent = message.senderId === currentUserId;
              return (
                <div
                  key={message._id}
                  className={`flex ${
                    isSent ? "justify-end" : "justify-start"
                  } group`}
                >
                  <div className="relative flex gap-2 items-center">
                    <div
                      className={`px-4 py-2 max-w-xs rounded-lg text-white ${
                        isSent ? "bg-violet-500" : "bg-gray-300 text-black"
                      }`}
                    >
                      {message.message}
                    </div>

                    {/* Seen icon */}
                    {isSent && message.seen && (
                      <CheckCheck className="w-4 h-4 text-green-500" />
                    )}

                    {/* Delete icon */}
                    {isSent && (
                      <Trash2
                        className="w-4 h-4 text-gray-500 hover:text-red-500 cursor-pointer opacity-0 group-hover:opacity-100 transition"
                        onClick={() => handleDeleteMessage(message._id)}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Input */}
          <div className="w-full flex h-[13%] items-center justify-center pr-4">
            <input
              placeholder="Type a message"
              type="text"
              className="bg-white w-[90%] px-3 py-1 outline-none rounded"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <button
              disabled={!text.trim()}
              onClick={handleSendMessage}
              className="hover:text-violet-500 hover:scale-105 transition-all"
            >
              <Send
                className={
                  text.trim()
                    ? "cursor-pointer"
                    : "opacity-50 cursor-not-allowed"
                }
              />
            </button>
          </div>
        </>
      ) : (
        <div className="flex w-[70%] justify-center items-center h-[80%]">
          <h1 className="text-2xl font-semibold">Start Messaging Now!</h1>
        </div>
      )}
    </div>
  );
};

export default ChatArea;
