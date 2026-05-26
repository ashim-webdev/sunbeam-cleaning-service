import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  MdKeyboardDoubleArrowDown,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
} from "react-icons/md";
import ModalWrapper from "./ModalWrapper";
import { Dialog } from "@headlessui/react";
import Button from "./ui/button";
import {PRIORITY_STYLES} from "../utils/index";



const ICONS = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  low: <MdKeyboardDoubleArrowDown />,
  normal: <MdKeyboardArrowDown />
};

const ViewNotification = ({ open, setOpen, el }) => {
  const { LightMode, user }  = useSelector((state) => state.auth);

  const lines = el?.text?.split("\n");
  const isLeave = el?.refModel === "Leave";

  // console.log(el)

  const assignedUsers = (el?.team || []).filter(
    (u) => u?._id?.toString() !== user?._id?.toString()
  );
  const visibleUsers = assignedUsers.slice(0, 3);

  return (
    <>
      <ModalWrapper open={open} setOpen={setOpen}>
        <div className='py-4 w-full flex flex-col gap-4 items-center justify-center'>
          <Dialog.Title as='h3' className={`font-semibold text-lg ${LightMode ? "text-black" : "text-white"}`}>
            {el?.task?.title}
          </Dialog.Title>


          <div className={`${LightMode ? "text-black/90" : "text-white/90"} space-y-3 flex flex-col justify-center items-center`}>
            <div className="space-y-2 flex flex-col justify-center items-center">
              {lines?.map((line, index) => {
                const parts = line.split(":");
                const key = parts[0];
                const value = parts.slice(1).join(":");

                if (key === "priority") {
                  return (
                    <p key={index} className="flex items-center gap-2">
                      Priority: <span className={PRIORITY_STYLES[value.trim()]}>{value}</span>
                      <span className={PRIORITY_STYLES[value.trim()]}>
                        {ICONS[value.trim()]}
                      </span>
                    </p>
                  );
                }
                if (key === "date") {
                  return (
                    <p key={index} className="flex items-center gap-2">
                      Date: {value}
                    </p>
                  );
                }

                return <p key={index}>{line}</p>;
              })}
            </div>
            

            {isLeave ? (
              <div className="flex flex-col items-center gap-2 mt-2">

                <img
                  src={el?.sender?.profileImage}
                  alt={el?.sender?.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-white"
                />

                <p className="font-semibold">
                  {el?.sender?.name}
                </p>

              </div>

            ) : (

              <>
                <p className="flex items-center gap-1">
                  Assigned to you
                  {assignedUsers.length > 1 && (
                    <span>
                      and {assignedUsers.length} others.
                    </span>
                  )}
                </p>

                <div className="flex items-center -space-x-2 mt-2">
                  {visibleUsers.slice(0, 3).map((user, index) => (
                    <img
                      key={index}
                      src={user?.profileImage}
                      alt="user"
                      className="w-8 h-8 rounded-full border-2 border-white object-cover"
                    />
                  ))}

                  {assignedUsers.length > 3 && (
                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-300 text-xs font-semibold">
                      +{assignedUsers.length - 3}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          <Button
            type='button'
            className='bg-blue-600 text-primary-foreground px-8 mt-3 text-sm font-semibold sm:w-auto border border-gray-300 cursor-pointer hover:bg-blue-700 hover:scale-102 active:scale-95 transition-transform duration-200 ease-in-out'
            onClick={() => setOpen(false)}
          >
            OK
          </Button>
        </div>
      </ModalWrapper>
    </>
  );
};

export default ViewNotification;
