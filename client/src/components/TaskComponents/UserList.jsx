import { Listbox, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { BsChevronExpand } from "react-icons/bs";
import { MdCheck } from "react-icons/md";
import { FaCrown } from "react-icons/fa";
import { useGetTeamListsQuery } from "../../redux/slices/api/userApiSlice.js";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { getInitials } from "../../utils/index.js";




export default function UserList({ team, setTeam }) {
  const { LightMode } = useSelector((state) => state.auth);
  
  const { data, isLoading, refetch } = useGetTeamListsQuery(
    {
      search: ""
    },
    {
      refetchOnMountOrArgChange: true,
      refetchOnReconnect: true,
      refetchOnFocus: true,
    }
  );

  // console.log(data)
  // console.log(team)

  const [selectedUsers, setSelectedUsers] = useState([]);

  // CheckBox Section
  const [leaderId, setLeaderId] = useState(null);

  // const handleChange = (users) => {
  //   const activeUsers = users
  //   .filter((u) => u?.isActive)
  //   .filter(
  //     (user, index, self) =>
  //       index === self.findIndex((u) => u._id === user._id)
  //   );

  //   setSelectedUsers(activeUsers);

  //   setTeam({
  //     members: activeUsers.map((u) => u._id),
  //     leader: leaderId,
  //   });

  //   if (!activeUsers.find((u) => u._id === leaderId)) {
  //     setLeaderId(null);
  //   }
  // };



  const handleChange = (users) => {
    const activeUsers = users
      .filter((u) => u?.isActive)
      .filter(
        (user, index, self) =>
          index === self.findIndex((u) => u._id === user._id)
      );

    setSelectedUsers(activeUsers);

    setTeam({
      members: activeUsers.map((u) => u._id.toString()),
      leader: leaderId ? leaderId.toString() : null,
    });

    // REMOVE LEADER IF NOT IN MEMBERS
    if (!activeUsers.find((u) => u._id === leaderId)) {
      setLeaderId(null);

      setTeam({
        members: activeUsers.map((u) => u._id.toString()),
        leader: null,
      });
    }
  };



  
  // const handleLeaderChange = (id) => {
  //   setLeaderId(id);

  //   setTeam((prev) => ({
  //     ...prev,
  //     leader: id,
  //   }));
  // };


  const handleLeaderChange = (id) => {
    const leaderString = id.toString();

    setLeaderId(leaderString);

    setTeam((prev) => ({
      ...prev,
      leader: leaderString,
    }));
  };



  useEffect(() => {
    if (!data?.users?.length) return;

    // EDIT MODE
    if (team?.members?.length) {

      const memberIds = team.members
        .filter(Boolean)
        .map((member) =>
          typeof member === "object"
            ? member?._id
            : member
        );

      let selected = data.users.filter((user) =>
        memberIds.includes(user._id)
      );

      // 🔥 FORCE INCLUDE LEADER EVEN IF NOT IN MEMBERS
      const leader =
        typeof team?.leader === "object"
          ? team?.leader?._id
          : team?.leader;

      if (leader && !selected.some(u => u._id === leader)) {
        const leaderUser = data.users.find(u => u._id === leader);
        if (leaderUser) {
          selected = [...selected, leaderUser];
        }
      }

      const uniqueSelected = selected.filter(
        (user, index, self) =>
          index === self.findIndex((u) => u._id === user._id)
      );

      setSelectedUsers(uniqueSelected);

      // Restore leader
      if (team?.leader) {
        setLeaderId(
          typeof team.leader === "object"
            ? team.leader._id
            : team.leader
        );
      }

      return;
    }

    // CREATE MODE
    const firstActiveUser = data?.users?.find(
      (user) => user.isActive
    );

    if (firstActiveUser) {
      setSelectedUsers([firstActiveUser]);

      setTeam({
        members: [firstActiveUser._id],
        leader: null,
      });
    }

  }, [data?.users, team]);



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
          <Listbox.Button 
            onClick={(e) => {
              if (data?.users?.length === 0) {
                e.preventDefault();
                e.stopPropagation();
                toast.error("No users available");
              }
            }}
            className={`
              ${LightMode 
                ? "bg-white text-black border-gray-300" 
                : "bg-black text-white border-gray-400"
              }
              relative w-full cursor-pointer rounded pl-3 pr-10 text-left px-3 py-2.5 2xl:py-3 border sm:text-sm transition-colors duration-300 ease-in-out
            `}>
            <span className="flex flex-wrap items-center gap-1">
              {data?.users?.length === 0 ? (
                <span className="text-gray-400">No active users</span>
              ) : (
                selectedUsers.length === 0 ? (
                  <span className="text-gray-400">Select Employees</span>
                ) 
                  :
                (
                  selectedUsers.map((user, index) => (
                    <div key={user._id} className="flex">
                      <div className={`${leaderId?.toString() === user._id?.toString() ? "block" : "hidden"} w-2.5 h-2.5 mx-0.5 rounded-full bg-green-500 shadow-inner animate-spin`} />
                      {user.name}
                      {index !== selectedUsers.length - 1 && user.isActive ? "," : null}
                    </div>
                  ))
                )
              )}
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
              {data?.users?.map((user) => (
                <Listbox.Option
                  key={user._id}
                  className={({ active }) =>
                    `relative select-none py-2 pl-10 pr-4 cursor-pointer ${
                      active ? `${LightMode ? "bg-blue-100 text-blue-900 hover:shadow-dark" : "bg-blue-900 text-blue-100 hover:shadow-light"}` : `${LightMode ? "text-gray-900" : "text-gray-200"}`
                    }`
                  }
                  disabled={!user.isActive}
                  value={user}
                >
                  {({ selected }) => (
                    <>
                      <div
                        onClick={(e) => {
                          if (user.isActive !== true) {
                            e.preventDefault();
                            e.stopPropagation();
                            toast.error("This user has been disabled");
                          }
                        }}
                          className={`flex items-center gap-2  relative hover:scale-102 active:scale-99 transition-transform duration-200 ease-in-out 
                          ${user.isActive ? "" : "opacity-50 cursor-not-allowed"}
                          ${
                            selected ? "font-medium" : "font-normal"
                          }
                        `}
                      >
                        <div className="relative">
                          <div className="relative">
                            <div
                              className={`
                                ${LightMode ? "shadow-inner" : "shadow-innerWH"}
                                w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-inner transition-colors ease-in-out duration-300 overflow-hidden `
                              }
                            >
                              {user?.profileImage ? 
                                <img src={user?.profileImage} alt="Avatar" className="w-full h-full object-cover "/>
                              :
                                <span className='text-center text-[10px]'>
                                  {getInitials(user?.name || "Unknown User")}
                                </span>
                              }
                            </div>
                            {user?.isAdmin && (
                              <span className="absolute -top-3 rotate-10 right-0">
                                <FaCrown className="text-yellow-500 text-md"/>
                              </span>
                            )}
                          </div>

                          <div className={`${selected && user.isActive ? "block" : "hidden"} absolute -top-1 left-1.5 flex`}>
                            <div className={`${leaderId?.toString() === user._id?.toString() ? "block" : "hidden"} w-2 h-2 mx-0.5 rounded-full bg-green-500 shadow-inner animate-spin`} />
                          </div>
                        </div>
                        <span className="flex items-center gap-2">
                          {user.name}
                          {leaderId?.toString() === user._id?.toString() && (
                            <span className="text-xs text-green-500 font-bold">
                              (Leader)
                            </span>
                          )}
                        </span>

                        <div className={` ${selected && user.isActive ? "block" : "hidden"} absolute top-0 right-0`}>
                          <div className="cl-toggle-switch">
                            <label className="cl-switch cursor-pointer">
                              <input 
                                type="checkbox" 
                                checked={leaderId?.toString() === user._id?.toString()}
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
                      {selected && user.isActive ? (
                        <span className='absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600'>
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
