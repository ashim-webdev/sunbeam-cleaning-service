import clsx from "clsx";
import { useDispatch, useSelector } from "react-redux";
import { IoMdAdd } from "react-icons/io";
import TaskColor from "./TaskColor";

const TaskTitle = ({ label, className }) => {
  const { LightMode } = useSelector((state) => state.auth);

  return (
    <div className={
      ` ${LightMode 
          ? "bg-white text-gray-600 shadow-inner"
          : "bg-black/90 text-gray-100 shadow-innerWH"
        }
        w-full h-10 md:h-12 px-2 md:px-4 rounded flex items-center justify-between transition-colors ease-in-out duration-300
      `}>
      <div className='flex gap-2 items-center'>
        <TaskColor className={className} />
        <p className='text-sm md:text-base  whitespace-nowrap'>
          {label}
        </p>
      </div>

      <button className='hidden md:block'>
        <IoMdAdd className={`
            ${LightMode 
              ? "text-black"
              : "text-white"
            }
            text-lg transition-colors ease-in-out duration-300
          `} />
      </button>
    </div>
  );
};

export default TaskTitle
