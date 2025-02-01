import VideoDisplay from "./video/VideoDisplay";
import VideoControls from "./video/VideoControls";
import Participants from "./Participants";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useHost } from "../../context/HostProvider";
import ParticipantsVideo from "./video/ParticipantsVideo";
import { RxCross2 } from "react-icons/rx";
import { useWindowSize } from "../../hooks/getWindowSize";
import ChatRoom from "./ChatRoom";

const HostRoom = () => {
  const { sessionId } = useParams();
  const {

    isHost,
    participants,
    hostStream,
    setHostStream,
    isScreenSharingEnabled,
    terminateSession,
    messages,
    inputMessage,
    setInputMessage,
    handleSendMessage,
  } = useHost();
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [modalType, setModalType] = useState<"participants" | "chat" | null>(
    null
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const { width } = useWindowSize();

  const request = useMemo(() => {
    if (participants) {
      let count = 0;
      participants.forEach((participant) => {
        if (participant.status === "pending") {
          count++;
        }
      });

      return count;
    }
  }, [participants]);

  if (!sessionId) {
    throw Error("Cannot fetch sessionId from params");
  }

  const getHostStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setHostStream(stream);

      stream
        .getVideoTracks()
        .forEach((track) => (track.enabled = isVideoEnabled));
      stream
        .getAudioTracks()
        .forEach((track) => (track.enabled = isAudioEnabled));
    } catch (err) {
      console.log("Error accessing media device: ", err);
    }
  };

  const toggleVideo = () => {
    if (hostStream) {
      hostStream.getVideoTracks().forEach((track) => {
        track.enabled = !isVideoEnabled;
      });
      setIsVideoEnabled(!isVideoEnabled);
    }
  };

  const toggleAudio = () => {
    if (hostStream) {
      hostStream.getAudioTracks().forEach((track) => {
        track.enabled = !isAudioEnabled;
      });
      setIsAudioEnabled(!isAudioEnabled);
    }
  };

  const openParticipantsModal = () => {
    setIsModalOpen(true);
    setModalType("participants");
  };

  const openChatModal = () => {
    setIsModalOpen(true);
    setModalType("chat");
  };

  useEffect(() => {
    getHostStream();
  }, []);

  useEffect(() => {
    if (width > 767) {
      setIsModalOpen(false);
    }
  }, [width]);

  return (
    <div className="relative flex flex-col justify-between md:flex-row h-screen w-screen overflow-hidden">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col w-full h-full items-center justify-between overflow-hidden p-1">
        {/* Participants Video */}
        <ParticipantsVideo participants={participants} />
        {/* Host's Video Stream */}
        <VideoDisplay
          className="flex-1 bg-charcoal-7 border border-charcoal-4 w-full px-2 h-full lg:h-full rounded-lg overflow-hidden"
          videoStyle="w-full h-full object-fit"
          stream={hostStream}
        />
        {isScreenSharingEnabled && (
          <div className="mr-auto ml-2 text-sm font-sans text-cobalt-4 font-light">
            Screen Sharing Enabled
          </div>
        )}
        {/* Video Controls */}
        <div className="m-2">
          <VideoControls
            className="bg-charcoal-7 border border-charcoal-4  rounded-lg p-3 flex gap-2 mx-auto  justify-center items-center"
            isHost={isHost}
            request={request}
            toggleVideo={toggleVideo}
            toggleAudio={toggleAudio}
            terminateSession={terminateSession}
            openParticipantsModal={openParticipantsModal}
            openChatModal={openChatModal}
            isVideoEnabled={isVideoEnabled}
            isAudioEnabled={isAudioEnabled}
            sessionId={sessionId}
          />
        </div>
      </div>
      {/* Right Sidebar */}
      <div className="hidden mx-2 md:flex flex-shrink-0 w-[300px] lg:w-[25%] h-full bg-charcoal-7 overflow-y-auto border-l border-charcoal-4">
        {(modalType === "participants" || modalType === null) && (
          <>
            <Participants />
          </>
        )}
        {modalType === "chat" && (
          <>
            <ChatRoom
              isHost={isHost}
              messages={messages}
              inputMessage={inputMessage}
              setInputMessage={setInputMessage}
              handleSendMessage={handleSendMessage}
              peerId={null}
            />
          </>
        )}
      </div>
      {isModalOpen && width < 767 && (
        <div className="absolute bg-opacity-90 bg-charcoal-7 w-full h-full ">
          <RxCross2
            onClick={() => {
              setIsModalOpen(false);
              setModalType(null);
            }}
            className="m-2 text-3xl font-extrabold hover:text-cobalt-4"
          />
          <div className="h-[90%]">
            {modalType === "participants" && <Participants />}
            {modalType === "chat" && (
              <ChatRoom
                isHost={isHost}
                messages={messages}
                peerId={null}
                inputMessage={inputMessage}
                setInputMessage={setInputMessage}
                handleSendMessage={handleSendMessage}
              />
            )}
          </div>
          ;
        </div>
      )}
    </div>
  );
};

export default HostRoom;
