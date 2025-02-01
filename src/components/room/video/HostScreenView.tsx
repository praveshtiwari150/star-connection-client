import { useDraggable } from '../../../hooks/useDraggable';
import VideoDisplay from './VideoDisplay';
import { usePeer } from '../../../context/PeerProvider';

interface HostScreenViewProps{
    className?: string;
}

const HostScreenView = ({className}: HostScreenViewProps) => {
    const {hostStream, screenStream} = usePeer();
    const {
      draggableElementRef,
      parentContainerRef,
      elementPosition,
      isElementDragging,
      startDragging,
      moveElement,
      stopDragging,
    } = useDraggable();

  return (
    
      <div
        className={className}
        ref={parentContainerRef}
      >
        <VideoDisplay
          videoStyle="w-full h-full object-fit"
          className="h-full w-full"
          stream={screenStream}
        />

        {hostStream && (
          <div
            ref={draggableElementRef}
            // Single click to swap videos
            onMouseDown={startDragging}
            onMouseMove={moveElement}
            onMouseUp={stopDragging}
            className={`absolute border-[2px] border-cobalt-8 flex justify-center w-[20%] rounded-lg ${
              isElementDragging ? "cursor-grab" : "cursor-default"
            } transform transition-transform duration-300 ease-in-out hover:scale-105`}
            style={{
              left: `${elementPosition.x}px`,
              top: `${elementPosition.y}px`,
            }}
          >
            <VideoDisplay
              className=""
              videoStyle="w-full rounded-lg h-full"
              stream={hostStream}
            />
          </div>
        )}
      </div>
  );
}

export default HostScreenView
