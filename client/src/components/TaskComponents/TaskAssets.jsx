import React from "react";
import { useSelector } from "react-redux";
import { BiMessageAltDetail } from "react-icons/bi";
import { FaList } from "react-icons/fa";
import { MdAttachFile } from "react-icons/md";
// import { getCompletedSubTasks } from "../../utils";

const TaskAssets = ({ activities, assets, subTasks }) => {
  const { LightMode } = useSelector((state) => state.auth);

  return (
    <div className={`
      ${LightMode 
        ? "text-gray-600"
        : "text-gray-300"
      }
      flex items-center gap-3 transition-colors ease-in-out duration-300
    `}>
      <div className='flex gap-1 items-center text-sm'>
        <BiMessageAltDetail />
        <span>{activities}</span>
      </div>
      <div className='flex gap-1 items-center text-sm'>
        <MdAttachFile />
        <span>{assets}</span>
      </div>
      <div className='flex gap-1 items-center text-sm'>
        <FaList />
        <span>
          {/* {getCompletedSubTasks(subTasks)}/{subTasks?.length} */}
          <span>{subTasks.length}</span>
        </span>
      </div>
    </div>
  );
};

export default TaskAssets;
