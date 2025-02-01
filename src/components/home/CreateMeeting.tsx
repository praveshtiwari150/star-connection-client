import { FormEvent, useState } from "react";
import { useHost } from "../../context/HostProvider";

interface CreateMeetingProps {
  className?: string;
}

const CreateMeeting = ({ className }: CreateMeetingProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const { createMeeting } = useHost();

  // Creates meeting
  const handleCreateMeeting = (event: FormEvent) => {
    event.preventDefault();
    console.log("createMeeting");
    createMeeting(name, email);
  };

  return (
    <form
      onSubmit={handleCreateMeeting}
      className={`${className} w-full max-w-md bg-charcoal-7 rounded-lg shadow-lg p-6 border border-charcoal-4 space-y-6`}
    >
      <h2 className="text-2xl font-bold font-mono text-cobalt-3">
        Start a New Meeting
      </h2>

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
          name="name"
          type="text"
          className="bg-charcoal-8 text-charcoal-1 rounded-lg outline-none px-4 py-2 shadow-sm border-2 border-charcoal-4 focus:border-cobalt-4 focus:ring-2 focus:ring-cobalt-4 transition duration-200 font-sans"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label
          className="font-semibold text-base text-charcoal-2"
          htmlFor="email"
        >
          Email
        </label>
        <input
          placeholder="johndoe@gmail.com"
          onChange={(event) => setEmail(event.target.value)}
          name="email"
          type="email"
          className="bg-charcoal-8 text-charcoal-2 rounded-lg outline-none px-4 py-2 shadow-sm border-2 border-charcoal-4 focus:border-cobalt-4 focus:ring-2 focus:ring-cobalt-4 transition duration-200 font-sans"
        />
      </div>

      <button
        type="submit"
        className="bg-cobalt-4 w-full px-4 py-2 rounded-lg text-cobalt-1 font-semibold hover:bg-cobalt-5 transition duration-200"
      >
        Create Meeting
      </button>
    </form>
  );
};

export default CreateMeeting;
