import { ChangeEvent } from "react";

interface MeetingToggleProps {
  meeting: "start" | "join";
  onToggle: (event: ChangeEvent<HTMLInputElement>) => void;
}

const MeetingToggle = ({ meeting, onToggle }: MeetingToggleProps) => {
  return (
    <div className="flex gap-8 justify-center items-center bg-charcoal-7 p-4 border border-charcoal-4 rounded-lg shadow-md">
      <div className="flex items-center gap-2">
        <input
          onChange={onToggle}
          type="radio"
          value="start"
          checked={meeting === "start"}
          className="form-radio h-5 w-5 text-cobalt-5"
        />
        <label htmlFor="" className="text-cobalt-3 font-medium">
          Create Meeting
        </label>
      </div>
      <div className="flex items-center gap-2">
        <input
          onChange={onToggle}
          type="radio"
          value="join"
          checked={meeting === "join"}
          className="form-radio h-5 w-5 text-indigo-600"
        />
        <label htmlFor="" className="text-cobalt-3 font-medium">
          Join Meeting
        </label>
      </div>
    </div>
  );
};

export default MeetingToggle;
