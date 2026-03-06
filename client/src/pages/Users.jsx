import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { toast } from "sonner";
import ConfirmationDialog from "../components/ConfirmationDialog";
import AddUser from "../components/AddUser";
import Loading from "../components/Loading";
import Button from "../components/Button";
import Title from "../components/Title";
import DeleteBtn from "../components/DeleteBtn";
import EditBtn from "../components/EditBtn";
// import {
//   useDeleteUserMutation,
//   useGetTeamListsQuery,
//   useUserActionMutation,
// } from "../redux/slices/api/userApiSlice";
import { useSelector } from "react-redux";
import { getInitials } from "../utils/index";
import { summary } from "../assets/data";
// import { useSearchParams } from "react-router-dom";

const Users = () => {
  const { LightMode } = useSelector((state) => state.auth);

  // const [searchParams] = useSearchParams();
  // const [searchTerm] = useState(searchParams.get("search") || "");

  // const { data, isLoading, refetch } = useGetTeamListsQuery({
  //   search: searchTerm,
  // });
  // const [deleteUser] = useDeleteUserMutation();
  // const [userAction] = useUserActionMutation();
  const [isLoading, setIsLoading] = useState(false);
  const [user, setIsUser] = useState(true);



  const [openDialog, setOpenDialog] = useState(false);
  const [open, setOpen] = useState(false);
  const [openAction, setOpenAction] = useState(false);
  const [selected, setSelected] = useState(null);

  const deleteClick = (id) => {
    setSelected(id);
    setOpenDialog(true);
  };

  const editClick = (el) => {
    setSelected(el);
    setOpen(true);
  };

  // const userStatusClick = (el) => {
  //   setSelected(el);
  //   setOpenAction(true);
  // };

  const deleteHandler = async () => {
    // try {
    //   const res = await deleteUser(selected);

    //   refetch();
    //   toast.success(res?.data?.message);
    //   setSelected(null);
    //   setTimeout(() => {
    //     setOpenDialog(false);
    //   }, 500);
    // } catch (error) {
    //   console.log(err);
    //   toast.error(err?.data?.message || err.error);
    // }
  };

  const userActionHandler = async () => {
    // try {
    //   const res = await userAction({
    //     isActive: !selected?.isActive,
    //     id: selected?._id,
    //   });

    //   refetch();
    //   toast.success(res?.data?.message);
    //   setSelected(null);
    //   setTimeout(() => {
    //     setOpenAction(false);
    //   }, 500);
    // } catch (error) {
    //   console.log(err);
    //   toast.error(err?.data?.message || err.error);
    // }
  };

  // useEffect(() => {
  //   refetch();
  // }, [open]);

  const TableHeader = () => (
    <thead className='border-b border-gray-300 dark:border-gray-600'>
      <tr className={`
            ${LightMode
                ? "text-black"
                : "text-white"
            }
          dark:text-white text-left transition-colors     duration-300 ease-in-out
          `}>
        <th className='py-2 pl-2'>Full Name</th>
        <th className='py-2 text-start pl-5.5'>Title</th>
        <th className='py-2 text-start pl-3.5'>Email</th>
        <th className='py-2 text-center'>Role</th>
        <th className='py-2 text-center'>Active</th>
        <th className='py-2 text-center'>Actions</th>
      </tr>
    </thead>
  );

  const TableRow = ({ user }) => (
    <tr className={`
          ${LightMode 
            ? "border-gray-300 text-gray-600 hover:bg-gray-300/50 hover:shadow-dark"
            : "border-gray-600 text-white/70 hover:bg-white/30 hover:shadow-light"
          }
          tableRow border hover:bg-gray-300/50  transition-colors ease-in-out duration-300 cursor-pointer
        `}>
      <td className='p-2'>
        <div className='flex items-center gap-3 whitespace-nowrap'>
          <div className='w-9 h-9 rounded-full text-white flex items-center justify-center text-sm bg-blue-600'>
            <span className='text-xs md:text-sm text-center'>
              {getInitials(user.name)}
            </span>
          </div>
          {user.name}
        </div>
      </td>
      <td className='p-2 px-6 whitespace-nowrap text-start '>{user.title}</td>
      <td className='p-2 px-4 text-start'>{user.email}</td>
      <td className='p-2 text-center'>{user.role}</td>
      <td className="px-4">
        <div className="flex justify-center items-center">
          <button
            onClick={(e) => e.stopPropagation()}
            className={clsx(
              "ClickAnimation w-fit px-3.5 py-1.5 rounded-full transition-transform ease-in-out duration-300 text-[15px] shadow-inner hover:shadow-innerWH  cursor-pointer",
              user ? "bg-green-500 text-white hover:bg-green-700 hover:scale-105" : "bg-red-500 text-whits hover:bg-red-700 hover:scale-110"
            )}
          >
            {user ? "Active" : "Disabled"}
          </button>
        </div>
        
      </td>
      <td className='p-2 flex gap-3 justify-center'>
        {/* <Button
          className='text-blue-600 hover:text-blue-500 font-semibold sm:px-0'
          label='Edit'
          type='button'
          onClick={() => editClick(user)}
        /> */}
        <EditBtn 
          onClick={() => editClick(user)}
        />

        {/* <Button
          className='text-red-700 hover:text-red-500 font-semibold sm:px-0'
          label='Delete'
          type='button'
          onClick={() => deleteClick(user?._id)}
        /> */}
        <DeleteBtn
          onClick={() => deleteClick(user?._id)}
        />
      </td>
    </tr>
  );

  return isLoading ? (
    <div className='py-10'>
      <Loading />
    </div>
  ) : (
    <>
      <div className='w-full md:px-1 px-0 mb-6'>
        <div className='flex items-center justify-between mb-8'>
          <Title title='  Team Members' />

          <Button
            label='Add New User'
            icon={<IoMdAdd className='text-lg' />}
            className='ClickAnimationNoti flex flex-row-reverse gap-1 items-center bg-blue-600 text-white rounded-md 2xl:py-2.5 shadow-inner hover:shadow-innerWH transition-colors duration-300 ease-in-out'
            onClick={() => setOpen(true)}
          />
        </div>
        <div className={`
            ${LightMode
              ? "bg-white"
              : "bg-black/90"
            }
            px-2 md:px-4 py-4 shadow rounded transition-colors duration-300 ease-in-out
          `}>
          <div className='overflow-x-auto'>
            <table className='w-full mb-5'>
              <TableHeader />
              <tbody>
                {summary.users?.map((user, index) => (
                  <TableRow key={index} user={user} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AddUser
        open={open}
        setOpen={setOpen}
        userData={selected}
        key={new Date().getTime().toString()}
      />

      <ConfirmationDialog
        open={openDialog}
        setOpen={setOpenDialog}
        onClick={deleteHandler}
      />

      {/* <UserAction
        open={openAction}
        setOpen={setOpenAction}
        onClick={userActionHandler}
      /> */}
    </>
  );
};

export default Users;
