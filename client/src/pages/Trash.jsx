import clsx from "clsx";
import React, { useState } from "react";
import {
  MdDelete,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
  MdKeyboardDoubleArrowDown,
  MdOutlineRestore,
} from "react-icons/md";
import { toast } from "sonner";

import Button from "../components/Button";
import Loading from "../components/Loading";
import Title from "../components/Title";
import TaskColor from "../components/TaskComponents/TaskColor";
import DeleteBtn from "../components/DeleteBtn";
import Del_Res from "../components/Del_Res";
import RestoreBtn from "../components/RestoreBtn";
import ConfirmationDialog from "../components/ConfirmationDialog";
import AddUser from "../components/AddUser";
// import {
//   useDeleteRestoreTastMutation,
//   useGetAllTaskQuery,
// } from "../redux/slices/api/taskApiSlice";
import { PRIORITY_STYLES, TASK_TYPE, TASK_ICON } from "../utils/index";
import { useSearchParams } from "react-router-dom";

import { useSelector } from "react-redux";


import { tasks } from "../assets/data";


const ICONS = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  low: <MdKeyboardDoubleArrowDown />,
  normal: <MdKeyboardArrowDown />
};

const Trash = () => {
  const { LightMode } = useSelector((state) => state.auth);
  
  const [isLoading, setIsLoading] = useState(false)
  const [openDialog, setOpenDialog] = useState(false);
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState(null);
  const [type, setType] = useState("delete");
  const [selected, setSelected] = useState("");
  const [searchParams] = useSearchParams();
  const [searchTerm] = useState(searchParams.get("search") || "");

  // const { data, isLoading, refetch } = useGetAllTaskQuery({
  //   strQuery: "",
  //   isTrashed: "true",
  //   search: searchTerm,
  // });
  // const [deleteRestoreTask] = useDeleteRestoreTastMutation();

  const deleteAllClick = () => {
    setType("deleteAll");
    setMsg("Do you want to permenantly delete all items?");
    setOpenDialog(true);
  };

  const restoreAllClick = () => {
    setType("restoreAll");
    setMsg("Do you want to restore all items in the trash?");
    setOpenDialog(true);
  };

  // const deleteClick = (id) => {
  //   setType("delete");
  //   setSelected(id);
  //   setOpenDialog(true);
  // };

  // const restoreClick = (id) => {
  //   setSelected(id);
  //   setType("restore");
  //   setMsg("Do you want to restore the selected item?");
  //   setOpenDialog(true);
  // };
  // WE GO HERE ON RESUME
  // const deleteRestoreHandler = async () => {
  //   try {
  //     let res = null;

  //     switch (type) {
  //       case "delete":
  //         res = await deleteRestoreTask({
  //           id: selected,
  //           actionType: "delete",
  //         }).unwrap();
  //         break;
  //       case "deleteAll":
  //         res = await deleteRestoreTask({
  //           id: "",
  //           actionType: "deleteAll",
  //         }).unwrap();
  //         break;
  //       case "restore":
  //         res = await deleteRestoreTask({
  //           id: selected,
  //           actionType: "restore",
  //         }).unwrap();
  //         break;
  //       case "restoreAll":
  //         res = await deleteRestoreTask({
  //           id: "",
  //           actionType: "restoreAll",
  //         }).unwrap();
  //         break;
  //     }

  //     toast.success(res?.message);

  //     setTimeout(() => {
  //       setOpenDialog(false);
  //       refetch();
  //     }, 500);
  //   } catch (err) {
  //     console.log(err);
  //     toast.error(err?.data?.message || err.error);
  //   }
  // };

  const TableHeader = () => (
    <thead className={`
        ${LightMode 
          ? "border-gray-400"
          : "border-gray-600"
        }
        border-b transition-colors ease-in-out duration-300
      `}>
      <tr className={`
          ${LightMode 
              ? "text-black"
              : "text-white"
          } text-left transition-colors ease-in-out duration-300
        `}>
        <th className='py-2 pl-4 whitespace-nowrap'>Task Title</th>
        <th className='py-2 px-6 whitespace-nowrap'>Client Names</th>
        <th className='py-2 px-6'>Address</th>
        <th className='py-2 pl-6.5 whitespace-nowrap text-start'>Priority</th>
        <th className='py-2 pr-1 whitespace-nowrap text-center'>Stage</th>
        <th className='py-2 line-clamp-1 whitespace-nowrap text-center'>Modified On</th>
        <th className='py-2 pr-4 whitespace-nowrap text-center'>Actions</th>
      </tr>
    </thead>
  );

  const TableRow = ({ item }) => {
  const title = item?.title;
  const textPriority = item?.priority;
  const titleShort = title.split(" ").length > 4 ? title.split(" ").slice(0, 5).join(" ") + "..." : title;
  const TextPriShort = textPriority.slice(0, 4) + "...";
  const nameShort = item.clientName.split(" ").length > 2 ? item.clientName.split(" ").slice(0, 2).join(" ") + "..." : item.clientName;
  const addressShort = item.address.split(" ").length > 2 ? item.address.split(" ").slice(0, 2).join(" ") + "..." : item.address;

    return (
    <tr className={`
          ${LightMode 
            ? "border-gray-300 text-gray-600 hover:bg-gray-300/50 hover:shadow-dark"
            : "border-gray-600 text-white hover:bg-white/30 hover:shadow-light"
          }
          tableRow border hover:bg-gray-300/50 cursor-pointer transition-colors ease-in-out duration-300
        `}>
      <td className='py-2 pl-4'>
        <div className='flex flex-nowrap items-center gap-2'>
          <TaskColor className={TASK_TYPE[item.stage]} />
          <p className={`
              ${LightMode 
                ? "text-black"
                : "text-white"
              }
              hidden xl:block whitespace-nowrap transition-colors ease-in-out duration-300 
            `}>
            {item.title}
          </p>
          <p className={`
              ${LightMode 
                ? "text-black"
                : "text-white"
              }
              xl:hidden whitespace-nowrap transition-colors ease-in-out duration-300 
            `}>
            {titleShort}
          </p>
        </div>
      </td>

      <td className="py-2 px-6">
        <p className={`
            ${LightMode 
              ? "text-black/70"
              : "text-white/70"
            }
            whitespace-nowrap transition-colors ease-in-out duration-300 capitalize 
          `}>
          {nameShort || "N/A"}
        </p>
      </td>

      <td className="py-2 px-4">
        <p className={`
            ${LightMode 
              ? "text-black/70"
              : "text-white/70"
            }
            whitespace-nowrap transition-colors ease-in-out duration-300 capitalize
          `}>
          {addressShort || "N/A"}
        </p>
      </td>

      <td className='py-2 capitalize px-6'>
        <div className={"flex flex-nowrap sm:hidden gap-1 items-center"}>
          <span className={clsx("text-lg", PRIORITY_STYLES[item?.priority])}>
            {ICONS[item?.priority]}
          </span>
          <span className='capitalize'>{TextPriShort}</span>
        </div>
        <div className={"hidden flex-nowrap sm:flex gap-1 items-center"}>
          <span className={clsx("text-lg animate-UpDown", PRIORITY_STYLES[item?.priority])}>
            {ICONS[item?.priority]}
          </span>
          <span className='capitalize'>{item?.priority}</span>
        </div>
      </td>

      <td className={`py-2 px-6 capitalize text-center  whitespace-nowrap`}>
        {item?.stage}
        &nbsp;
        <i className={`animate-UpDown ${TASK_ICON[item?.stage].icon} ${TASK_ICON[item?.stage].color}`}></i>
      </td>
      
      <td className={`
          ${LightMode 
            ? "text-black/50"
            : "text-white/60"
          }
          py-2  px-4 text-sm whitespace-nowrap text-center transition-colors ease-in-out duration-300 
        `}>{new Date(item?.date).toDateString()}</td>

      <td className='py-2  px-6 flex flex-nowrap gap-3 justify-center'>
        {/* <Button
          icon={<MdOutlineRestore className='text-xl text-gray-500' />}
          onClick={() => restoreClick(item._id)}
        /> */}
        <RestoreBtn />

        {/* <Button
          icon={<MdDelete className='text-xl text-red-600' />}
          onClick={() => deleteClick(item._id)}
        /> */}
        <DeleteBtn />
      </td>
    </tr>
  );
}

  return isLoading ? (
    <div className='py-10'>
      <Loading />
    </div>
  ) : (
    <>
      <div className='w-full md:px-1 px-0 mb-6'>
        <div className='flex items-center  justify-between mb-8'>
          <Title title='Trashed Tasks' />

          {tasks?.length > 0 && (
            <div className='relative flex flex-col md:flex-row mr-2 md:mr-0 gap-2 md:gap-4 items-center pl-4'>
              {/* <Button
                label='Restore All'
                icon={<MdOutlineRestore className='text-lg hidden md:flex' />}
                className='flex flex-row-reverse gap-1 items-center  text-black text-sm md:text-base rounded-md 2xl:py-2.5'
                // onClick={() => restoreAllClick()}
              /> */}
              <Del_Res
                onClick={() => restoreAllClick()}
                className={"bg-[#001fe5] hover:bg-[#000ecc] border border-[#000acc] active:border-[#0c00b2]"}
                spanClass={"bg-[#1b03b6] active:bg-[#1d0298]"}
                text="Restore All" 
                svg={
                <svg 
                  className="svg"
                  height="512"
                  width="512"
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 640 640"
                >
                  <path 
                    style={{
                      fill: "#fff",
                      strokeWidth: "32px"
                    }}
                    d="M544.1 256L552 256C565.3 256 576 245.3 576 232L576 88C576 78.3 570.2 69.5 561.2 65.8C552.2 62.1 541.9 64.2 535 71L483.3 122.8C439 86.1 382 64 320 64C191 64 84.3 159.4 66.6 283.5C64.1 301 76.2 317.2 93.7 319.7C111.2 322.2 127.4 310 129.9 292.6C143.2 199.5 223.3 128 320 128C364.4 128 405.2 143 437.7 168.3L391 215C384.1 221.9 382.1 232.2 385.8 241.2C389.5 250.2 398.3 256 408 256L544.1 256zM573.5 356.5C576 339 563.8 322.8 546.4 320.3C529 317.8 512.7 330 510.2 347.4C496.9 440.4 416.8 511.9 320.1 511.9C275.7 511.9 234.9 496.9 202.4 471.6L249 425C255.9 418.1 257.9 407.8 254.2 398.8C250.5 389.8 241.7 384 232 384L88 384C74.7 384 64 394.7 64 408L64 552C64 561.7 69.8 570.5 78.8 574.2C87.8 577.9 98.1 575.8 105 569L156.8 517.2C201 553.9 258 576 320 576C449 576 555.7 480.6 573.4 356.5z"/>
                </svg>
              }/>


              {/* <Button
                label='Delete All'
                icon={<MdDelete className='text-lg hidden md:flex' />}
                className='flex flex-row-reverse gap-1 items-center  text-red-600 text-sm md:text-base rounded-md 2xl:py-2.5'
                // onClick={() => deleteAllClick()}
              /> */}
              <Del_Res 
                onClick={() => deleteAllClick()}
                className={"bg-[#e50000] hover:bg-[#cc0000] border border-[#cc0000] active:border-[#b20000]"}
                spanClass={"bg-[#cc0000] active:bg-[#b20000]"}
                text="Delete All" 
                svg={
                  <svg
                    className="svg"
                    height="512"
                    viewBox="0 0 512 512"
                    width="512"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <title></title>
                    <path
                      d="M112,112l20,320c.95,18.49,14.4,32,32,32H348c17.67,0,30.87-13.51,32-32l20-320"
                      style={{
                        fill: "none",
                        stroke: "#fff",
                        strokeLinecap: "round",strokeLinejoin: "round",
                        strokeWidth: "32px"
                      }}
                    ></path>
                    <line
                      style={{
                        stroke: "#fff",
                        strokeLinecap: "round",strokeMiterlimit: "10",strokeWidth: "32px"
                      }}
                      x1="80"
                      x2="432"
                      y1="112"
                      y2="112"
                    ></line>
                    <path
                      d="M192,112V72h0a23.93,23.93,0,0,1,24-24h80a23.93,23.93,0,0,1,24,24h0v40"
                      style={{
                        fill: "none",
                        stroke: "#fff",
                        strokeLinecap: "round",strokeLinejoin: "round",strokeWidth: "32px"
                      }}
                    ></path>
                    <line
                      style={{
                        fill: "none",
                        stroke: "#fff",
                        strokeLinecap: "round",strokeLinejoin: "round",strokeWidth: "32px"
                      }}
                      x1="256"
                      x2="256"
                      y1="176"
                      y2="400"
                    ></line>
                    <line
                      style={{
                        fill: "none",
                        stroke: "#fff",
                        strokeLinecap: "round",strokeLinejoin: "round",strokeWidth: "32px"
                      }}
                      x1="184"
                      x2="192"
                      y1="176"
                      y2="400"
                    ></line>
                    <line
                      style={{
                        fill: "none",
                        stroke: "#fff",
                        strokeLinecap: "round",strokeLinejoin: "round",strokeWidth: "32px"
                      }}
                      x1="328"
                      x2="320"
                      y1="176"
                      y2="400"
                    ></line>
                    </svg>
              }/>

              <div className={`
                  ${LightMode 
                    ? "bg-linear-to-t from-gray-600/0 to-gray-700"
                    : "bg-linear-to-t from-gray-500/0 to-gray-300"
                  }
                  absolute md:hidden -top-1 sm:left-0 left-1 w-0.5 h-25 transition-colors ease-in-out duration-300
                `} />
            </div>
          )}
        </div>
        {tasks?.length > 0 ? (
          <div className={`
              ${LightMode 
                ? "bg-white shadow-md shadow-black/30"
                : "bg-black/90 shadow-md shadow-white/30"
              }
              px-6 py-4 shadow-md rounded transition-colors ease-in-out duration-300
            `}>
            <div className='overflow-x-auto'>
              <table className='w-full mb-5'>
                <TableHeader />
                <tbody>
                  {tasks?.map((tk, id) => (
                    <TableRow key={id} item={tk} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className='w-full flex justify-center py-10'>
            <p className={`
                ${LightMode 
                  ? "text-gray-500"
                  : "text-gray-200"
                }
                text-lg transition-colors ease-in-out duration-300 
              `}>No Trashed Task</p>
          </div>
        )}
      </div>

      <AddUser open={open} setOpen={setOpen} />

      <ConfirmationDialog
        open={openDialog}
        setOpen={setOpenDialog}
        msg={msg}
        setMsg={setMsg}
        type={type}
        setType={setType}
        onClick={() => deleteRestoreHandler()}
      />
    </>
  );
};

export default Trash;
