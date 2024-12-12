import { FormEvent, useState } from "react";
import { useHost } from "../../context/HostProvider";

const CreateMeeting = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const { createMeeting } = useHost();

  // creates meeting
  const handleCreateMeeting = (event: FormEvent) => {
    event?.preventDefault();
    console.log('createMeeting')
    createMeeting(name, email);
  };

  return (
    <>
      <form
        onSubmit={handleCreateMeeting}
        className="flex flex-col h-[250px] border border-cobalt-4 p-8 rounded-xl gap-4 justify-center items-center"
      >
        <div className="flex gap-2">
          <label className="text-lg" htmlFor="email">
            Name
          </label>
          <input
            onChange={(event) => setName(event.target.value)}
            name="name"
            type="text"
            className="bg-cobalt-2 text-charcoal-6 rounded-md outline-none px-3"
          />
        </div>
        <div className="flex gap-2">
          <label className="text-lg" htmlFor="email">
            Email
          </label>
          <input
            onChange={(event) => setEmail(event.target.value)}
            name="email"
            type="email"
            className="bg-cobalt-2 text-charcoal-6 rounded-md outline-none px-3"
          />
        </div>
        <div className="w-full">
          <button className="bg-cobalt-4 w-full p-2 rounded-lg hover:bg-inidgo-6">
            Create Meeting
          </button>
        </div>
      </form>
    </>
  );
};

export default CreateMeeting;
