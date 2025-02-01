import { usePeer } from '../../../context/PeerProvider';
import VideoDisplay from './VideoDisplay';

interface HostParticipantViewProps{
  className?: string;
}

const HostParticipantView = ({className}:HostParticipantViewProps) => {
  const { hostStream, peerStream, peerName } = usePeer();
  return (
    <div className={className}>
      <div className="relative m-1 border border-charcoal-2 rounded-lg">
        <div className="absolute top-2 left-2 bg-charcoal-7 text-sm font-mono px-1 rounded-lg opacity-85">
          Host
        </div>
        <VideoDisplay
          className=""
          videoStyle="rounded-lg h-full"
          stream={hostStream}
        />
      </div>
      <div className="relative m-1 border border-charcoal-2 rounded-lg">
        <div className="absolute top-2 left-2 bg-charcoal-7 text-sm font-mono px-1 rounded-lg opacity-85">
          {peerName || "You"}
        </div>
        <VideoDisplay videoStyle="rounded-lg h-full" stream={peerStream} />
      </div>
    </div>
  );
}

export default HostParticipantView
