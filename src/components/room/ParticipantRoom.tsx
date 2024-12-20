import { useEffect } from "react";
import VideoDisplay from "./video/VideoDisplay";
import VideoControls from "./video/VideoControls";
import { useMedia } from "../../context/StreamProvider";
import { useParams } from "react-router-dom";
import { usePeer } from "../../context/PeerProvider";

const ParticipantRoom = () => {
  const { sessionId } = useParams();
  const {
    localStream,
    toggleVideo,
    toggleAudio,
    audioEnabled,
    videoEnabled,
    getLocalStream,
  } = useMedia();
  const { peerName, hostStream } = usePeer();

  useEffect(() => {
    getLocalStream();
  }, []);

  if (!sessionId) {
    throw Error("Cannot fetch sessionId from params");
  }

  return (
    <div className="min-h-screen p-4 grid gap-4 lg:grid-cols-4">
      <div
        className={`flex flex-col justify-center items-center gap-4 border rounded-lg p-4 transition-transform duration-300 ${"lg:col-span-4"}`}
      >
        {/* VideoDisplay */}
        <div className="">
          <div>
            <div>{peerName}</div>
            <VideoDisplay stream={localStream} />
          </div>
          <div>
            <div>Host</div>
            <VideoDisplay stream={hostStream} />
          </div>
        </div>

        {/* VideoControls */}
        <VideoControls
          toggleVideo={toggleVideo}
          toggleAudio={toggleAudio}
          videoEnabled={videoEnabled}
          audioEnabled={audioEnabled}
          sessionId={sessionId}
        />
      </div>
    </div>
  );
};

export default ParticipantRoom;
