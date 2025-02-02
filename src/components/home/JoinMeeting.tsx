import { useState } from "react";
import { usePeer } from "../../context/PeerProvider";

const JoinMeeting = () => {
  const [name, setName] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { sendJoinRequest } = usePeer();

  const handleJoinMeeting = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      await sendJoinRequest(name, sessionId);
    }
    catch (err) {
      console.error("Error joining meeting:", err);
    }
    finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      className="w-full max-w-md bg-charcoal-7 rounded-lg shadow-lg p-6 border border-charcoal-4 space-y-6"
      onSubmit={handleJoinMeeting}
    >
      {/* Heading */}
      <h2 className="text-2xl font-bold font-mono text-cobalt-3">
        Join a Meeting
      </h2>

      {/* Name Input */}
      <div className="flex flex-col gap-2">
        <label
          className="font-semibold text-base text-charcoal-2"
          htmlFor="name"
        >
          Name
        </label>
        <input
          placeholder="John Doe"
          onChange={(event) => setName(event.target.value)}
          type="text"
          className="bg-charcoal-8 text-charcoal-2 rounded-lg outline-none px-4 py-2 shadow-sm border-2 border-charcoal-4 focus:border-cobalt-4 focus:ring-2 focus:ring-cobalt-4 transition duration-200 font-sans"
        />
      </div>

      {/* Session ID Input */}
      <div className="flex flex-col gap-2">
        <label
          className="font-semibold text-base text-charcoal-2"
          htmlFor="sessionId"
        >
          Session ID
        </label>
        <input
          placeholder="Enter Session ID"
          onChange={(event) => setSessionId(event.target.value)}
          type="text"
          className="bg-charcoal-8 text-charcoal-2 rounded-lg outline-none px-4 py-2 shadow-sm border-2 border-charcoal-4 focus:border-cobalt-4 focus:ring-2 focus:ring-cobalt-4 transition duration-200 font-sans"
        />
      </div>

      {/* Join Meeting Button */}
      <button
        type="submit"
        className="bg-cobalt-4 w-full px-4 py-2 rounded-lg text-cobalt-1 font-semibold hover:bg-cobalt-5 transition duration-200"
        disabled={isLoading}
      >
        {isLoading ? "Joining..." : "Join Meeting"}
      </button>
    </form>
  );
};

export default JoinMeeting;
