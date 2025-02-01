import React from "react";
import { MdPeopleAlt, MdScreenShare } from "react-icons/md";
import { BsChatRight } from "react-icons/bs";
import { RxCross2 } from "react-icons/rx";
import { FaRegCircleStop } from "react-icons/fa6";
import { useHost } from "../../../context/HostProvider";

interface DropdownMenuProps {
  setOpenMenu: React.Dispatch<React.SetStateAction<boolean>>;
  openParticipantsModal?: () => void;
  openChatModal?: () => void;
  request: number | undefined;
}

const DropdownMenu = ({
  setOpenMenu,
  openChatModal,
  openParticipantsModal,
  request
}: DropdownMenuProps) => {

  const { startShareScreen, stopShareScreen, screenStream, isScreenSharingEnabled } = useHost();
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
            if (openParticipantsModal) {
              openParticipantsModal();
            }
          }}
          className="flex justify-start items-center gap-2  m-1 p-2 hover:bg-cobalt-4 rounded"
        >
          <MdPeopleAlt />
          <div>Participants</div>
          {request !== undefined && request > 0 && (
            <div className="absolute top-0 left-0 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {request}
            </div>
          )}
        </button>
        <button
          onClick={() => {
            setOpenMenu(false);
            if(openChatModal) openChatModal();
          }}
          className=" w-full p-2 flex justify-start items-center gap-2 hover:bg-cobalt-4 rounded"
        >
          <BsChatRight />
          <div>Chat</div>
        </button>
        <button
          onClick={isScreenSharingEnabled ? () => stopShareScreen(screenStream!) : startShareScreen}
          className="p-2 flex justify-start items-center gap-2  m-1 hover:bg-cobalt-4 rounded"
        >
          {isScreenSharingEnabled ? <FaRegCircleStop /> : <MdScreenShare />}
          <div>{isScreenSharingEnabled ? "Stop Screen" : "Share Screen"}</div>
        </button>
      </div>
    </div>
  );
};

export default DropdownMenu;
