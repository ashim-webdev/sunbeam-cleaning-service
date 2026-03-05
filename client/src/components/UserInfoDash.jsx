import { useState } from "react";
import { Popover, Transition } from "@headlessui/react";
import {
  useFloating,
  offset,
  flip,
  shift,
  autoUpdate
} from '@floating-ui/react'
import { useSelector } from "react-redux";
import { Fragment } from "react";
import clsx from "clsx";
import { getInitials, BGS } from "../utils";
import GroupedTeam from "./GroupedTeam";

export default function UserInfoDash({ task }) {
  const { LightMode } = useSelector((state) => state.auth);
  
  const team = task.team;

  // Displaying the remaining team members
  const visibleCount = 3;
  const remainingItems = team.slice(visibleCount);



  const [open, setOpen] = useState(false)

  const { refs, floatingStyles } = useFloating({
    open,
    onOpenChange: setOpen,
    placement: "top-end",
    strategy: "fixed",
    middleware: [
      offset(0),   // spacing from button
      flip(),      // 👈 this makes it open top if bottom has no space
      shift(),     // keeps it inside screen
    ],
    whileElementsMounted: autoUpdate,
  })

  return (
    <div className="relative flex items-center -mr-6 ml-4">
      {/* Show first 2 avatars */}
      {team.slice(0, 3).map((member, index) => (
        <div
          key={member._id}
          className="relative"
        > 
          <div className={clsx(
            "w-9 h-9 rounded-full border border-white flex items-center justify-center text-white text-sm -ml-4 shadow-inner overflow-hidden",
            BGS[index % BGS.length]
          )}>
            {member?.img ? 
              <img src={member?.img} alt="Avatar" className="w-full h-full object-cover "/>
            :
              <span>
                {getInitials(member?.name)}
              </span>
            }
          </div>

          <div className={`absolute ${member.isLeader ? "block" : "hidden"} -top-1 -left-1 w-2.5 h-2.5 rounded-full bg-green-500 shadow-inner animate-spin`} />
        </div>
      ))}

      {/* PLUS BUTTON */}
      {team.length > 2 && (
        <Popover className="relative ml-1">
          {({ open }) => (
            <div className={clsx("relative", open && "z-50")}>
              {team.length > 3 
                ?
                <Popover.Button 
                  ref={refs.setReference}
                  onClick={() => setOpen(!open)}
                  className="outline-none z-10 w-9 h-9 border border-white -ml-5.5 rounded-full text-[10px] bg-gray-400 hover:bg-gray-500 text-white flex items-center justify-center active:scale-95 focus:border transition-all duration-200 ease-in-out hover:scale-105  cursor-pointer shadow-inner hover:shadow-innerWH"
                >
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
                  onClose={() => {}}
                >
                  <Popover.Panel
                    ref={refs.setFloating}
                    style={floatingStyles}
                    onMouseOver={(e) => e.stopPropagation()} className={`
                      ${LightMode 
                        ? "bg-white shadow-dark"
                        : "bg-black/90 shadow-light"
                      }
                      ${remainingItems.length > 3 ? "overflow-y-auto h-60" : "h-fit" }
                      absolute w-fit  z-90 -right-6 mt-3 rounded p-2 cursor-pointer transition-colors ease-in-out duration-300
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