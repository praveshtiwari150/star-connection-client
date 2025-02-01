import { useState } from "react";
import { FaCaretDown, FaCaretUp } from "react-icons/fa6";
interface Participant {
  peerId: string;
  peerName: string;
  status: "accepted" | "pending";
  stream: MediaStream | null;
}

interface ParticipantsVideoProps {
  participants: Participant[];
}

const ParticipantsVideo = ({ participants }: ParticipantsVideoProps) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const toggeleDrawer = () => { setIsDrawerOpen(prev => !prev) };

  return (
    <div className="relative w-full mb-6">
      <div
        className={`bg-charcoal-7 border border-charcoal-4 justify-center items-center overflow-hidden rounded-lg w-full transition-all duration-500 ${
          isDrawerOpen ? "flex min-h-[150px]" : "hidden"
        }`}
      >
        {/* Scrollable Horizontal Container */}
        {isDrawerOpen && (
          <div className="flex gap-4 px-4 w-full overflow-x-auto scroll-smooth hide-scrollbar">
            {participants.map(
              (participant) =>
                participant.status === "accepted" && (
                  <div
                    key={participant.peerId}
                    className="relative w-[180px] md:w-[220px] h-[120px] md:h-[150px] overflow-hidden border border-charcoal-4 flex flex-col items-center justify-center bg-black text-white rounded-lg flex-shrink-0"
                  >
                    {/* Participant Name */}
                    <div className="absolute top-2 left-2 bg-gray-800 bg-opacity-75 text-sm px-2 py-1 rounded">
                      {participant.peerName}
                    </div>
                    {/* Video Stream */}
                    {participant.stream ? (
                      <video
                        className="w-full h-full object-cover"
                        ref={(video) => {
                          if (video && participant.stream) {
                            video.srcObject = participant.stream;
                            video
                              .play()
                              .catch(() =>
                                console.log(
                                  "Error playing video for peer:",
                                  participant.peerName
                                )
                              );
                          }
                        }}
                        muted
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full text-sm bg-charcoal-5">
                        No Video
                      </div>
                    )}
                  </div>
                )
            )}
          </div>
        )}
      </div>
      {/* Toggle Button */}
      <button
        className="absolute bottom-[-15px] left-1/2 transform -translate-x-1/2 bg-charcoal-7 border border-charcoal-4 rounded-full  cursor-pointer hover:bg-cobalt-4"
        onClick={toggeleDrawer}
      >
        {isDrawerOpen ? <FaCaretUp size={24} /> : <FaCaretDown size={24} />}
      </button>
    </div>
  );
};

export default ParticipantsVideo;