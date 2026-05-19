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

export default function UserInfo({ task }) {
  const { LightMode } = useSelector((state) => state.auth);
  
  // const team = task?.team?.members ?? [];

  // Merging Members and Leader together
  const members = (task?.team?.members || []).map((member) => ({
    ...member,
    isLeader: false,
  }));

  const leader = task.team?.leader
    ? {
        ...task.team.leader,
        isLeader: true,
      }
    : null;

  const team = leader
    ? [...members, leader]
    : members;
    

  // console.log(team)

  // Displaying the remaining team members
  const visibleCount = 3;
  const remainingItems = team.slice(visibleCount);

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
            {member?.profileImage ? 
              <img src={member?.profileImage} alt="Avatar" className="w-full h-full object-cover "/>
            :
              <span>
                {getInitials(member?.name || "Unknown User")}
              </span>
            }
          </div>

          <div className={`absolute ${member.isLeader ? "block" : "hidden"} -top-1 -left-1 w-2.5 h-2.5 rounded-full bg-green-500 shadow-inner animate-spin`} />
        </div>
      ))}

      {/* PLUS BUTTON */}
      {team.length > 2 && (
        <div className="ml-1">
            <div className="relative">
              {team.length > 3 
                ?
                <div 
                  className="w-9 h-9 -ml-5.5 rounded-full text-[10px] bg-gray-500 text-white border border-white flex items-center justify-center shadow-inner ">
                  {remainingItems.length > 0 && (
                    <>
                      <i className="fa-solid fa-plus" />
                      <span className="text-[16px]">{remainingItems.length}</span>
                    </>
                  )}
                </div>
                : 
                null
              }
            </div>
        </div>
      )}

    </div>
  );
}