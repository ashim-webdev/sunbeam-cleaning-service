import { Popover, Transition } from "@headlessui/react";
import moment from "moment";
import { Fragment, useState } from "react";
import { BiSolidMessageRounded } from "react-icons/bi";
import { HiBellAlert } from "react-icons/hi2";
import { IoIosNotificationsOutline } from "react-icons/io";
import { setLightMode } from "../redux/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
// import {
//   useGetNotificationsQuery,
//   useMarkNotiAsReadMutation,
// } from "../redux/slices/api/userApiSlice";
// import ViewNotification from "./ViewNotification";


const data =[
  {
    _id: "2773fh3hg34413hgd724kj3j3",
    team: [
      "d6a5ds6d7f7657d656fdf6d57s66",
      "6dsf6f6sd6s65df6sd55d65d656d",
      "s6s7fs7df87sfs68df87d7sd87d7"
    ],
    text: "New task has been assigned to you and 2 others. The task priority is set at Normal priority, so check and act accordingly. The task data is Thu Feb 29 2024. Thank you!!!",
    task: null,
    notiType: "alert",
    isRead: [],
    createAt: "2024-02-09t05:45:23.353Z",
    updatedAt: "2024-02-09t05:45:23.353Z",
    __v: 0,
  },
  {
    _id: "2773fh3hg34413hgd724kj3j3",
    team: [
      "d6a5ds6d7f7657d656fdf6d57s66",
      "6dsf6f6sd6s65df6sd55d65d656d",
      "s6s7fs7df87sfs68df87d7sd87d7"
    ],
    text: "New task has been assigned to you and 2 others. The task priority is set at Normal priority, so check and act accordingly. The task data is Thu Feb 29 2024. Thank you!!!",
    task: null,
    notiType: "alert",
    isRead: [],
    createAt: "2024-02-09t05:45:23.353Z",
    updatedAt: "2024-02-09t05:45:23.353Z",
    __v: 0,
  },

]



const ICONS = {
  alert: (
    <HiBellAlert className='h-5 w-5 text-gray-600 group-hover:text-indigo-600' />
  ),
  message: (
    <BiSolidMessageRounded className='h-5 w-5 text-gray-600 group-hover:text-indigo-600' />
  ),
};

export default function NotificationPanel() {
  const { LightMode } = useSelector((state) => state.auth);

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  // const { data, refetch } = useGetNotificationsQuery();
  // const [markAsRead] = useMarkNotiAsReadMutation();

  // const viewHandler = (el) => {
  //   setSelected(el);
  //   readHandler("one", el._id);
  //   setOpen(true);
  // };

  const readHandler = async (type, id) => {
    await markAsRead({ type, id }).unwrap();

    refetch();
  };

  const callsToAction = [
    { name: "Cancel", href: "#", icon: "" },
    {
      name: "Mark All Read",
      href: "#",
      icon: "",
      onClick: () => readHandler("all", ""),
    },
  ];

  return (
    <>
      <Popover className='relative mr-3'>
        <Popover.Button className='inline-flex items-center outline-none'>
          <div className={`
              ${LightMode 
                ? "text-"
                : "text-white"
              }
              ClickAnimationNoti w-8 h-8 flex items-center justify-center  relative cursor-pointer  transition-transform hover:scale-105 ease-in-out duration-300
            `}>
            <IoIosNotificationsOutline className='text-2xl' />
            {data?.length > 0 && (
              <span className='absolute text-center -top-1 right-0 text-sm text-white font-semibold w-5 h-5  rounded-full bg-red-600'>
                {data?.length}
              </span>
            )}
          </div>
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
          <Popover.Panel className='absolute top-8 max-[500px]:-right-21 -right-16 sm:-right-8  md:-right-10 z-10 mt-5 flex w-screen max-w-max  px-4'>
            {({ close }) =>
              data?.length > 0 && (
                <div className={`
                  ${LightMode 
                    ? "bg-white"
                    : "bg-black/90 border border-white text-white"
                  }
                  w-screen max-w-md flex-auto overflow-hidden rounded-3xl text-sm leading-6 shadow-lg ring-1 ring-gray-900/5 transition-colors ease-in-out duration-300
                `}>
                  <div className='p-4'>
                    {data?.slice(0, 5).map((item, index) => (
                      <div
                        key={item._id + index}
                        className={`
                            ${LightMode 
                              ? "hover:bg-white"
                              : "hover:bg-transparent"
                            }
                            group relative flex gap-x-4 rounded-lg p-4   transition-transform hover:scale-105 ease-in-out duration-200
                          `}
                      >
                        <div className={`
                            ${LightMode 
                              ? ""
                              : ""
                            }
                            mt-1 h-8 w-8 flex items-center justify-center rounded-lg
                          `}>
                          {ICONS[item.notiType]}
                        </div>

                        <div
                          className='cursor-pointer text-red-400'
                          onClick={() => viewHandler(item)}
                        >
                          <div className={`
                              ${LightMode 
                                ? "text-gray-900"
                                : "text-white"
                              }
                              flex items-center gap-3 font-semibold transition-colors ease-in-out duration-300 capitalize
                            `}>
                            <p> {item.notiType}</p>
                            <span className='text-xs font-normal lowercase text-green-600'>
                              {moment(item.createdAt).fromNow()}
                            </span>
                          </div>
                          <p className={`
                              ${LightMode 
                                ? "text-black"
                                : "text-white/80"
                              }
                              line-clamp-1 mt-1 transition-colors ease-in-out duration-300
                            `}>
                            {item.text}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className={`
                      ${LightMode 
                        ? "bg-gray-50"
                        : "text-white/60 border border-t-gray-500/50"
                      }
                      grid grid-cols-2 divide-x  divide-gray-500/90 transition-colors ease-in-out duration-300
                    `}>
                    {callsToAction.map((item) => (
                      <Link
                        key={item.name}
                        onClick={
                          item?.onClick ? () => item.onClick() : () => close()
                        }
                        className={`
                            ${LightMode 
                              ? "hover:bg-gray-100"
                              : "hover:bg-[#65646472]"
                            }
                            ClickAnimationNoti flex items-center hover:shadow-innerWH justify-center gap-x-2.5 p-3 font-semibold text-blue-600 transition-colors ease-in-out duration-300 
                          `}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )
            }
          </Popover.Panel>
        </Transition>
      </Popover>
      {/* <ViewNotification open={open} setOpen={setOpen} el={selected} /> */}
    </>
  );
}
