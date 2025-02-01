import {  useState } from "react";
import { AiFillAudio, AiOutlineAudioMuted } from "react-icons/ai";
import {
  HiOutlineVideoCamera,
  HiOutlineVideoCameraSlash,
} from "react-icons/hi2";
import {
  MdContentCopy,
  MdCheck,
} from "react-icons/md";
import { TbPhoneEnd } from "react-icons/tb";
import { BsThreeDotsVertical } from "react-icons/bs";
import ControlLabel from "./ControlLabel";
import DropdownMenu from "./DropdownMenu";
import { BsChatRight } from "react-icons/bs";

interface VideoControlsProps {
  className?: string;
  isHost: boolean;
  request?: number;
  toggleVideo: () => void;
  toggleAudio: () => void;
  terminateSession: (flag: boolean) => void;
  isAudioEnabled: boolean;
  isVideoEnabled: boolean;
  isScreenSharingEnabled?: boolean;
  sessionId: string;
  openParticipantsModal?: () => void;
  openChatModal?: () => void;
  isChatOpen?: boolean;
  setIsChatOpen?: React.Dispatch<React.SetStateAction<boolean>>
}

const VideoControls = ({
  className,
  isHost,
  request,
  toggleVideo,
  toggleAudio,
  terminateSession,
  isAudioEnabled,
  isVideoEnabled,
  sessionId,
  openParticipantsModal,
  openChatModal,
  setIsChatOpen
}: VideoControlsProps) => {
  const [copied, setCopied] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(sessionId);
    setCopied(true);

    // Reset the button after 2 seconds
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={className}>
      {/* Toggle Video */}
      <ControlLabel label={isVideoEnabled ? "Disable Video" : "Enable Video"}>
        <button
          onClick={toggleVideo}
          className="bg-cobalt-4 hover:bg-cobalt-6 p-4 rounded-full"
        >
          {isVideoEnabled ? (
            <HiOutlineVideoCamera className="text-white" />
          ) : (
            <HiOutlineVideoCameraSlash className="text-white" />
          )}
        </button>
      </ControlLabel>

      {/* Toggle Audio */}
      <ControlLabel label={isAudioEnabled ? "Mute Audio" : "Unmute Audio"}>
        <button
          onClick={toggleAudio}
          className="bg-cobalt-4 hover:bg-cobalt-6 p-4 rounded-full"
        >
          {isAudioEnabled ? (
            <AiFillAudio className="text-white" />
          ) : (
            <AiOutlineAudioMuted className="text-white" />
          )}
        </button>
      </ControlLabel>

      {/* End Meeting */}
      <ControlLabel label="End Call">
        <button
          onClick={() => terminateSession(false)}
          className="bg-cobalt-4 hover:bg-cobalt-6 p-4 rounded-full"
        >
          <TbPhoneEnd className="text-white" />
        </button>
      </ControlLabel>

      {/* Copy Session ID */}
      <ControlLabel label={copied ? "Session ID Copied!" : "Copy Session ID"}>
        <button
          onClick={handleCopy}
          className={`bg-cobalt-4 hover:bg-cobalt-6 p-4 rounded-full transition-transform duration-300 ${
            copied ? "scale-110" : "scale-100"
          }`}
        >
          {copied ? (
            <MdCheck className="text-white transition-opacity duration-300" />
          ) : (
            <MdContentCopy className="text-white transition-opacity duration-300" />
          )}
        </button>
      </ControlLabel>

      <div className="relative">
        {isHost ? (
          <>
            <ControlLabel label="More">
              <div className="relative flex items-center">
                <button
                  onClick={() => {
                    setOpenMenu((prev) => !prev);
                  }}
                  className="bg-cobalt-4 hover:bg-cobalt-6 p-4 rounded-full"
                >
                  <BsThreeDotsVertical />
                </button>
                {!openMenu && request !== undefined && request > 0 && (
                  <div className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {request}
                  </div>
                )}
              </div>
            </ControlLabel>
            {openMenu && (
              <DropdownMenu
                request={request}
                setOpenMenu={setOpenMenu}
                openParticipantsModal={openParticipantsModal}
                openChatModal={openChatModal}
              />
            )}
          </>
        ) : (
          <ControlLabel label={"Chat"}>
              <button
                onClick={() => setIsChatOpen && setIsChatOpen(prev => !prev)}
              className={"bg-cobalt-4 hover:bg-cobalt-6 p-4 rounded-full"}
            >
              <BsChatRight/>
            </button>
          </ControlLabel>
        )}
      </div>
    </div>
  );
};

export default VideoControls;
