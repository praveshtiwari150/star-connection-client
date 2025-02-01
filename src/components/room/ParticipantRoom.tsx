import VideoControls from "./video/VideoControls";
import { useParams } from "react-router-dom";
import { usePeer } from "../../context/PeerProvider";
import { RxCross2 } from "react-icons/rx";
import { useWindowSize } from "../../hooks/getWindowSize";
import { useState } from "react";
import HostScreenView from "./video/HostScreenView";
import HostParticipantView from "./video/HostParticipantView";
import ChatRoom from "./ChatRoom";

const ParticipantRoom = () => {
  const { sessionId } = useParams();
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const { width } = useWindowSize();

  const {
    isVideoEnabled,
    isAudioEnabled,
    setIsAudioEnabled,
    setIsVideoEnabled,
    terminateSession,
    peerId,
    peerStream,
    screenStream,
    messages,
    inputMessage,
    setInputMessage,
    handleSendMessage,
  } = usePeer();

  const toggleVideo = () => {
    if (peerStream) {
      peerStream.getVideoTracks().forEach((track: MediaStreamTrack) => {
        track.enabled = !isVideoEnabled;
      });
      setIsVideoEnabled(!isVideoEnabled);
    }
  };

  const toggleAudio = () => {
    if (peerStream) {
      peerStream.getAudioTracks().forEach((track: MediaStreamTrack) => {
        track.enabled = !isAudioEnabled;
      });
      setIsAudioEnabled(!isAudioEnabled);
    }
  };

  if (!sessionId) {
    throw Error("Cannot fetch sessionId from params");
  }

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen overflow-hidden">
      {/* Main content area */}
      <div className="flex-1 flex flex-col h-full w-full p-2">
        {/* Video Display */}
        {screenStream ? (
          <HostScreenView
            className={
              "flex-1 relative bg-charcoal-7 border border-charcoal-4 rounded-lg overflow-hidden"
            }
          />
        ) : (
          <HostParticipantView
            className={
              "flex-1 flex justify-center items-center gap-2 bg-charcoal-7 border border-charcoal-4 rounded-lg overflow-hidden"
            }
          />
        )}

        {/* Video Controls */}
        <div className="mt-2">
          <VideoControls
            className="bg-charcoal-7 w-max border border-charcoal-4 rounded-lg p-3 flex gap-2 mx-auto justify-center items-center"
            isHost={false}
            toggleVideo={toggleVideo}
            toggleAudio={toggleAudio}
            terminateSession={terminateSession}
            isVideoEnabled={isVideoEnabled}
            isAudioEnabled={isAudioEnabled}
            sessionId={sessionId}
            isChatOpen={isChatOpen}
            setIsChatOpen={setIsChatOpen}
          />
        </div>
      </div>

      {/* Right Sidebar */}
      {isChatOpen && (
        <div className="hidden mx-2 md:flex flex-shrink-0 w-[300px] lg:w-[25%] h-full bg-charcoal-7 overflow-y-auto border-l border-charcoal-4">
          <ChatRoom
            messages={messages}
            inputMessage={inputMessage}
            setInputMessage={setInputMessage}
            handleSendMessage={handleSendMessage}
            peerId={peerId}
          />
        </div>
      )}
      {isChatOpen && width <= 767 && (
        <div className="absolute bg-opacity-90 bg-charcoal-7 w-full h-full ">
          <RxCross2
            onClick={() => {
              setIsChatOpen(false);
            }}
            className="m-2 text-3xl font-extrabold hover:text-cobalt-4"
          />
          <ChatRoom
            messages={messages}
            inputMessage={inputMessage}
            setInputMessage={setInputMessage}
            handleSendMessage={handleSendMessage}
            peerId={peerId}
          />
        </div>
      )}
    </div>
  );
};

export default ParticipantRoom;
