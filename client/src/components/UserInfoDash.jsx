import { Popover, Transition } from "@headlessui/react";
import { useSelector } from "react-redux";
import { Fragment } from "react";
import clsx from "clsx";
import { getInitials, BGS } from "../utils";
import GroupedTeam from "./GroupedTeam";

export default function UserInfoDash({ task }) {
  const { LightMode } = useSelector((state) => state.auth);
  
  const team = task.team ?? [];

  // Displaying the remaining team members
  const visibleCount = 3;
  const remainingItems = team.slice(visibleCount);

  return (
    <div className="relative flex items-center -mr-6 ml-4">
      {/* Show first 2 avatars */}
      {team.slice(0, 3).map((member, index) => (
        <div
          key={member._id}
          className={clsx(
            "relative w-9 h-9 rounded-full flex items-center justify-center text-white text-sm border-2 border-black -ml-4 shadow-inner",
            BGS[index % BGS.length]
          )}
        >
          {getInitials(member.name)}

          <div className={`absolute ${member.isLeader ? "block" : "hidden"} -top-1 left-2.5 w-2.5 h-2.5 rounded-full bg-green-500 shadow-inner animate-spin`}></div>
        </div>
      ))}

      {/* PLUS BUTTON */}
      {team.length > 2 && (
        <Popover className="relative ml-1">
          {({ open }) => (
            <div className={clsx("relative", open && "z-50")}>
              {team.length > 3 
                ?
                <Popover.Button className="ClickAnimation z-10 w-9 h-9 -ml-5.5 rounded-full text-[10px] bg-gray-400 hover:bg-gray-500 text-white border border-black flex items-center justify-center hover:scale-105 transition cursor-pointer shadow-inner hover:shadow-innerWH">
                  {remainingItems.length > 0 && (
                    <>
                      <i className="fa-solid fa-plus" />
                      <span className="text-[16px]">{remainingItems.length}</span>
                    </>
                  )}
                </Popover.Button>
                : 
                null
              }

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-200"
                  enterFrom="opacity-0 translate-y-1"
                  enterTo="opacity-100 translate-y-0"
                  leave="transition ease-in duration-150"
                  leaveFrom="opacity-100 translate-y-0"
                  leaveTo="opacity-0 translate-y-1"
                >
                  <Popover.Panel onMouseOver={(e) => e.stopPropagation()} className={`
                      ${LightMode 
                        ? "bg-white shadow-dark"
                        : "bg-black/90 shadow-light"
                      }
                      absolute -right-6 mt-3 rounded p-2 cursor-pointer transition-colors ease-in-out duration-300
                    `}>
                    <GroupedTeam team={team} />
                  </Popover.Panel>
                </Transition>
            </div>
          )}
        </Popover>
      )}

    </div>
  );
}