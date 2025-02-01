import { FaRegCheckCircle } from "react-icons/fa";
import { RiCloseCircleLine } from "react-icons/ri";
import { useHost } from "../../context/HostProvider";

const Participants = () => {
  const { participants, acceptParticipant, removeAndUpdateParticipant } =
    useHost();

  return (
    <div className="w-full h-full flex flex-col p-4 gap-4 bg-charcoal-7 text-cobalt-4 md:rounded-lg md:shadow-lg">
      <div className="w-full mb-4">
        <h2 className="text-2xl font-bold text-cobalt-5 mb-2">Requests</h2>
        <div className="flex flex-col gap-2 overflow-auto custom-scrollbar max-h-32 md:max-h-48">
          {participants.map(
            (participant) =>
              participant.status === "pending" && (
                <div
                  className="flex justify-between items-center p-2 bg-charcoal-6 rounded shadow-md"
                  key={participant.peerId}
                >
                  <div className="text-lg font-semibold">
                    {participant.peerName}
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="text-xl text-green-500 hover:text-green-400"
                      onClick={() =>
                        acceptParticipant(participant.peerId)
                      }
                    >
                      <FaRegCheckCircle />
                    </button>
                    <button
                      className="text-xl text-red-500 hover:text-red-400"
                      onClick={() =>
                        removeAndUpdateParticipant(participant.peerId)
                      }
                    >
                      <RiCloseCircleLine />
                    </button>
                  </div>
                </div>
              )
          )}
        </div>
      </div>

      <div className="w-full flex-1">
        <h2 className="text-2xl font-bold text-cobalt-5 mb-2">Participants</h2>
        <div className="flex flex-col gap-2 overflow-auto custom-scrollbar max-h-full">
          {participants.map(
            (participant) =>
              participant.status === "accepted" && (
                <div
                  className="flex justify-between items-center p-2 bg-charcoal-6 rounded shadow-md"
                  key={participant.peerId}
                >
                  <div className="text-lg font-semibold">
                    {participant.peerName}
                  </div>
                </div>
              )
          )}
        </div>
      </div>
    </div>
  );
};

export default Participants;
