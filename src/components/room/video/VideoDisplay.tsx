import { useEffect, useRef,memo } from "react";

interface VideoDisplayProps {
  onDoubleClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  stream: MediaStream | null;
  className?: string;
  videoStyle?: string;
  key?: string | number;
  muted: boolean;
}

const VideoDisplay = memo(({key, className,videoStyle, stream, onDoubleClick, muted }: VideoDisplayProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div key={key} onDoubleClick={onDoubleClick} className={className}>
      <video
        className={videoStyle}
        ref={videoRef}
        muted={muted}
        autoPlay
        playsInline
      />
    </div>
  );
});

export default VideoDisplay;
