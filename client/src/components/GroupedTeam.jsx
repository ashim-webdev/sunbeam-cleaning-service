import clsx from "clsx";
import { getInitials, BGS } from "../utils";
import { useSelector } from "react-redux";

export default function GroupedTeam({ team = [] }) {
  const { LightMode } = useSelector((state) => state.auth);


  return (
    <div className="">
      <table className="min-w-[320px] ">
        <tbody>
          {team.map((member, index) => (
            <tr
              key={index}
              className={`
                ${LightMode
                  ? "border-gray-300 text-gray-600 hover:bg-gray-300/50 hover:shadow-dark duration-300"
                  : "border-gray-600 text-white hover:bg-white/30 hover:shadow-light duration-300"}
                MembersTable relative border-b transition-colors transform hover:scale-102 duration-200
              `}
            >
              <td className={`
                  py-2 px-4
                `}>
                <span className="flex items-center gap-3">
                  <span className={clsx(
                      LightMode
                      ? "text-white"
                      : "text-white",
                      "w-10 h-10 rounded-full   flex items-center justify-center shadow-inner transition-colors ease-in-out duration-300",
                      BGS[index % BGS.length]
                    )}>
                    {getInitials(member.name)}
                  </span>
                  <span>
                    <p className={`
                        ${LightMode
                          ? "text-gray-700"
                          : "text-white/70"}
                        whitespace-nowrap transition-colors ease-in-out duration-300 italic
                      `}>{member.name}</p>
                    <span className={`
                        ${LightMode
                          ? "text-black"
                          : "text-white"
                        }
                        text-xs font-bold transition-colors ease-in-out duration-300
                      `}>{member.title.split(" ").length > 2 ? member.title.split(" ").slice(0, 1).join(" ") + "..." : member.title}</span>
                  </span>
                </span>
              </td>

              <td className={`
                  ${LightMode
                    ? "text-gray-900"
                    : "text-white/80"
                  }
                  hidden pt-5 sm:block px-4 text-sm text-center transition-colors ease-in-out duration-300
                `}>
                {member.email.slice(0, 1) + "......@......com" ?? "email@example.com"}
              </td>
              
              <td>
                <span className={`
                    ${ member.isLeader 
                      ? "text-green-600" 
                      : "text-blue-600/60"
                    }
                    text-lg absolute -top-2.5 left-7.5
                  `}><i className="fa-solid fa-flag"></i></span>
                <span className={`
                    ${ member.isLeader 
                      ? "text-green-600 bg-green-500/50 shadow-inner right-4 sm:right-24 sm:bottom-5" 
                      : "text-blue-600 bg-blue-500/50 shadow-inner right-6 sm:right-26 sm:bottom-5"
                    }
                    LeaderTable font-bold p-2 rounded-tl-3xl rounded-br-3xl  italic text-sm absolute bottom-3 sm:hidden  
                  `}>
                    {member.isLeader ? "Leader" : "Crew"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}