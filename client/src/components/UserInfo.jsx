import clsx from "clsx";
import { Popover, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { getInitials, BGS } from "../utils";

export default function UserInfo({ team, index }) {
  return (
    <div className='text-center font-bold m-0.5 w-9 h-9 rounded-full text-white flex items-center justify-center text-sm  border border-black'>
      <Popover className='relative'>
        {({ open }) => (
          <>
            <Popover.Button
              className={`hover:scale-110 transition-transform ease-in-out duration-200 group inline-flex items-center outline-none`}
            >
              <span
                className="text-center font-bold p-2 cursor-pointer  
                ">
                {getInitials(team?.name)}
              </span>
            </Popover.Button>
            <Transition
              as={Fragment}
              enter='transition ease-out duration-200'
              enterFrom='opacity-0 translate-y-1'
              enterTo='opacity-100 translate-y-0'
              leave='transition ease-in duration-150'
              leaveFrom='opacity-100 translate-y-0'
              leaveTo='opacity-0 translate-y-1'
            >
              <Popover.Panel className='absolute -left-27 mt-3 z-10 w-80 max-w-sm -translate-x-1/2 transform px-4 sm:px-0 '>
                <div className='flex items-center gap-4 rounded-lg shadow-lg bg-white p-4'>
                  
                  <div className={clsx(
                    "w-16 h-16 rounded-full text-white flex items-center justify-center text-2xl ",
                    BGS[index % BGS?.length]
                  )}>
                    <span className='text-center font-bold'>
                      {getInitials(team?.name)}
                    </span>
                  </div>
                  <div className='flex flex-col gap-y-1'>
                    <p className='text-black text-xl font-bold'>{team?.name}</p>
                    <span className='text-base text-gray-500'>
                      {team?.title}
                    </span>
                    <span className='text-blue-500'>
                      {team?.email ?? "email@example.com"}
                    </span>
                  </div>
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    </div>
  );
}
