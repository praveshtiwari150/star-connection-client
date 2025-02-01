import {  useRef, useEffect } from "react";


interface Message {
  text: string;
  name: string;
  timestamp: number;
  peerId: string | null;
}
interface ChatRoomProps {
  isHost: boolean;
    messages: Message[];
    inputMessage: string;
    setInputMessage: React.Dispatch<React.SetStateAction<string>>;
    handleSendMessage: () => void;
    peerId: string|null;
}


const ChatRoom = ({
  isHost,
  messages,
  inputMessage,
  peerId,
  setInputMessage,
  handleSendMessage
}: ChatRoomProps) => {
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  // const formatTime = (time: number) => {
  //   const date = new Date(time);
  //   return date.toLocaleTimeString([], {
  //     hour: "2-digit",
  //     minute: "2-digit",
  //     hour12: true,
  //   });
  // };

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    console.log("Messages: ", messages);
  }, [messages]);

  return (
    <div className="w-full h-full overflow-auto hide-scrollbar  flex flex-col items-center p-4 gap-4 font-mono bg-charcoal-7 text-cobalt-4 md:rounded-lg md:shadow-lg">
      <h2 className="text-2xl font-bold text-center text-cobalt-5 p-4">
        Chat Room
      </h2>

      <div className="w-full flex flex-col gap-2 flex-grow overflow-auto hide-scrollbar h-96 p-2 border border-charcoal-4 rounded-lg">
        {messages.map((message, index) => (
          <div
            className={`flex ${
              message.peerId === peerId ? "justify-end" : "justify-start"
            } items-center`}
            key={index}
          >
            <div
              className={`p-3 max-w-xs text-sm rounded-lg shadow-md ${
                message.peerId === peerId
                  ? "bg-cobalt-4 text-cobalt-1 rounded-br-none"
                  : "bg-charcoal-6 text-cobalt-2 rounded-bl-none"
              }`}
            >
              <span className="text-xs font-light block mb-1 text-cobalt-1">
                {message.peerId === peerId ? "You" : message.name}
              </span>
              {message.text}
            </div>
          </div>
        ))}
        <div ref={chatBottomRef}></div>
      </div>

      <div className="w-full mt-auto flex gap-2">
        <input
          type="text"
          className="flex-grow p-2 rounded bg-charcoal-4 border border-cobalt-4 text-cobalt-3"
          placeholder="Type a message..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
        />
        <button
          className="bg-cobalt-4 hover:bg-cobalt-6 text-white p-2 rounded"
          onClick={handleSendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;
