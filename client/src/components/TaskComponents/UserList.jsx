import { Listbox, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { BsChevronExpand } from "react-icons/bs";
import { MdCheck } from "react-icons/md";
// import { useGetTeamListsQuery } from "../../redux/slices/api/userApiSlice.js";
import { useSelector } from "react-redux";
import { getInitials } from "../../utils/index.js";
import { summary } from "../../assets/data.js";

export default function UserList({ team, setTeam }) {
  const { LightMode } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(false)
  // const { data, isLoading } = useGetTeamListsQuery({ search: "" });
  const [selectedUsers, setSelectedUsers] = useState([]);

  // CheckBox Section
  const [leaderId, setLeaderId] = useState(null);

  const handleChange = (users) => {
    setSelectedUsers(users);
    setTeam(users.map((u) => u._id));

    // If current leader is removed, reset leader
    if (!users.find((u) => u._id === leaderId)) {
      setLeaderId(null);
    }
  };

  const handleLeaderChange = (id) => {
    setLeaderId(id);
  };

  useEffect(() => {
    setTeam({
      members: selectedUsers.map((u) => u._id),
      leader: leaderId,
    });
  }, [selectedUsers, leaderId]);

  // console.log("Selected Users:", selectedUsers);
  // console.log("Leader ID:", leaderId);

  // END

  const data = summary.users;



  useEffect(() => {
    if (team?.length < 1) {
      data && setSelectedUsers([data[0]]);
    } else {
      setSelectedUsers(team);
    }
  }, [isLoading]);

  return (
    <div className=''>
      <p className={`
        ${LightMode 
          ? "text-black" 
          : "text-white"
        }
        transition-colors duration-300 ease-in-out
      `}>Assign Task To:</p>
      <Listbox
        value={selectedUsers}
        onChange={(el) => handleChange(el)}
        multiple
      >
        <div className='relative mt-1'>
          <Listbox.Button className={`
              ${LightMode 
                ? "bg-white text-black border-gray-300" 
                : "bg-black text-white border-gray-400"
              }
              relative w-full cursor-pointer rounded pl-3 pr-10 text-left px-3 py-2.5 2xl:py-3 border sm:text-sm transition-colors duration-300 ease-in-out
            `}>
            <span className="flex flex-wrap items-center gap-1">
              {selectedUsers?.map((user, index) => (
                <div key={user._id} className="flex">
                  <div className={`${leaderId === user._id ? "block" : "hidden"} w-2.5 h-2.5 mx-0.5 rounded-full bg-green-500 shadow-inner animate-spin`} />
                  {user.name}
                  {index !== selectedUsers.length - 1 && ","}
                </div>
              ))}
            </span>

            <span className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 '>
              <BsChevronExpand
                className={`h-5 w-5 ${LightMode ? "text-gray-700" : "text-gray-300"}`}
                aria-hidden='true'
              />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave='transition ease-in duration-100'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <Listbox.Options className={`
              ${LightMode 
                ? "bg-white ring-black/20" 
                : "bg-black ring-white/20"
              }
              z-50 absolute mt-1 max-h-60 w-full overflow-auto rounded-md py-1 text-base shadow-lg ring-1 focus:outline-none sm:text-sm transition-colors duration-300 ease-in-out
            `}>
              {data?.map((user, userIdx) => (
                <Listbox.Option
                  key={userIdx}
                  className={({ active }) =>
                    `relative select-none py-2 pl-10 pr-4 cursor-pointer ${
                      active ? `${LightMode ? "bg-amber-100 text-amber-900 hover:shadow-dark" : "bg-amber-900 text-amber-100 hover:shadow-light"}` : `${LightMode ? "text-gray-900" : "text-gray-200"}`
                    }`
                  }
                  value={user}
                >
                  {({ selected }) => (
                    <>
                      <div
                        className={`flex items-center gap-2  relative hover:scale-102 active:scale-99 transition-transform duration-200 ease-in-out ${
                          selected ? "font-medium" : "font-normal"
                        }`}
                      >
                        <div className="relative">
                          <div
                            className={`
                              ${LightMode ? "shadow-inner" : "shadow-innerWH"}
                              w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-inner transition-colors ease-in-out duration-300 overflow-hidden `
                            }
                          >
                            {user?.img ? 
                              <img src={user?.img} alt="Avatar" className="w-full h-full object-cover "/>
                            :
                              <span className='text-center text-[10px]'>
                                {getInitials(user?.name)}
                              </span>
                            }
                          </div>

                          <div className={`${selected ? "block" : "hidden"} absolute -top-1 left-1.5 flex`}>
                            <div className={`${leaderId === user._id ? "block" : "hidden"} w-2 h-2 mx-0.5 rounded-full bg-green-500 shadow-inner animate-spin`} />
                          </div>
                        </div>
                        <span>{user.name}</span>

                        <div className={` ${selected ? "block" : "hidden"} absolute top-0 right-0`}>
                          <div className="cl-toggle-switch">
                            <label className="cl-switch cursor-pointer">
                              <input 
                                type="checkbox" 
                                checked={leaderId === user._id}
                                onChange={(e) => {
                                  e.stopPropagation();
                                  handleLeaderChange(user._id);
                                }}
                              />
                              <span></span>
                            </label>
                          </div>
                        </div>
                        
                      </div>
                      {selected ? (
                        <span className='absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600'>
                          <MdCheck className='h-5 w-5' aria-hidden='true' />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}
