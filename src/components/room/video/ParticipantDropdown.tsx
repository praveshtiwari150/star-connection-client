import React from "react";
import { MdScreenShare } from "react-icons/md";
import { BsChatRight } from "react-icons/bs";
import { RxCross2 } from "react-icons/rx";
import { usePeer } from "../../../context/PeerProvider";

interface DropdownMenuProps {
  setOpenMenu: React.Dispatch<React.SetStateAction<boolean>>;
  openChatModal?: () => void;
}

const ParticipantDropdown = ({
  setOpenMenu,
  openChatModal,
}: DropdownMenuProps) => {
  const { streams } = usePeer();
  return (
    <div className="absolute w-40  bg-charcoal-7 border p-0 pb-2 rounded-lg -top-44 right-1">
      <div
        onClick={() => setOpenMenu((prev) => !prev)}
        className="text-xl ml-auto  w-max relative p-1 hover:text-cobalt-4"
      >
        <RxCross2 className="font-extrabold" />
      </div>
      <div className="relative font-mono ml-1 w-max">
        <button
          onClick={() => {
            setOpenMenu(false);
            if (openChatModal) openChatModal();
          }}
          className=" w-full p-2 flex justify-start items-center gap-2 hover:bg-cobalt-4 rounded"
        >
          <BsChatRight />
          <div>Chat</div>
        </button>
      </div>
      {streams.length >= 2 && (
        <>
          <div className="relative font-mono ml-1 w-max">
            <button className=" w-full p-2 flex justify-start items-center gap-2 hover:bg-cobalt-4 rounded">
              <div>Host Video</div>
            </button>
          </div>
          <div className="relative font-mono ml-1 w-max">
            <button className=" w-full p-2 flex justify-start items-center gap-2 hover:bg-cobalt-4 rounded">
              <MdScreenShare />
              <div>Host Screen</div>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ParticipantDropdown;
