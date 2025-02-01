import React from "react";

interface ControlLabelProps {
  label: string;
  children: React.ReactNode;
}

const ControlLabel = ({ label, children }: ControlLabelProps) => {
  return (
    <div className="group relative flex items-center">
      {children}
      <span
        className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2
          text-cobalt-3 font-mono text-sm
          px-4 py-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100
          transition duration-300 ease-in-out text-center whitespace-nowrap
          min-w-[100px] max-w-[200px]"
      >
        {label}
      </span>
    </div>
  );
};

export default ControlLabel;
