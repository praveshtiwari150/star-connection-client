import React from 'react'

interface ParticipantTileProps {
  participantsStreams: MediaStream[];
}

const ParticipantTile : React.FC<ParticipantTileProps> = ({ participantsStreams }) => {
  return (
    <div>
      {participantsStreams ? (
        <>
          {participantsStreams.map((stream) => (
            <video
              key={stream.id}
              ref={(video) => {
                if (video) {
                  video.srcObject = stream;
                  video.play();
                }
              }}
              className="h-24 w-24 object-cover rounded-lg"
              playsInline
              autoPlay
            />
          ))}
        </>
      ) : (
        <div>No Participant Found</div>
      )}
    </div>
  );
}

export default ParticipantTile
