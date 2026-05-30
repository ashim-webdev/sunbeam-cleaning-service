import { useState } from 'react';
import ProfileInfo from './ProfileInfo';
import { useDispatch, useSelector } from "react-redux";
import { useGetTeamListsQuery } from '../../redux/slices/api/userApiSlice';
import ModalWrapper from '../ModalWrapper';
import AddUser from '../AddUser';
import ConfirmationDialog from '../ConfirmationDialog';
import ProfileCard from './ProfileCard';



const ViewUserProfile = ({ 
  open, 
  setOpen, 
  profileSelected, 
  openDialog, 
  setOpenDialog, 
  deleteHandler,
  setSelected,
  selected,
}) => {
  const { LightMode }  = useSelector((state) => state.auth);

   // FETCH FRESH USERS
  const { data } = useGetTeamListsQuery(
    {
      page: 1,
      limit: 100,
      type: "",
    },
    {
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
      refetchOnReconnect: true,
    }
  );

  const users = data?.users || [];

  const freshUser =
    users.find((user) => user._id === profileSelected?._id) ||
    profileSelected;


  const [openEdit, setOpenEdit] = useState(false);

  const deleteClick = (id) => {
    setSelected(id);
    setOpenDialog(true);
  };

  const editClick = (el) => {
    setSelected(el);
    setOpenEdit(true);
  };

  return (
    <ModalWrapper open={open} openDialog={openDialog} setOpenDialog={setOpenDialog} setOpen={setOpen} profile={true}>
      <div className='w-full flex md:flex-row flex-col justify-center items-center gap-10 '>
        <ProfileCard onClick={(e) => e.stopPropagation()} profileSelected={freshUser} setOpen={setOpen} editClick={editClick} deleteClick={deleteClick} componentType="ViewUserProfile" />

        <div onClick={(e) => e.stopPropagation()} className='bg-blue-400/70 backdrop-blur-[2px] border border-blue-200/30 shadow-[0_8px_32px_rgba(0,0,0,0.25)] w-90 sm:w-120 h-full px-2 py-4 rounded-lg'>
          <ProfileInfo userProfileData={freshUser}/>
        </div>

        {openDialog &&
          <ConfirmationDialog
            open={openDialog}
            setOpen={setOpenDialog}
            onClick={deleteHandler}
          />
        }

        <AddUser
          open={openEdit}
          setOpen={setOpenEdit}
          userData={selected}
        />
      </div>
    </ModalWrapper>
  )
}

export default ViewUserProfile;