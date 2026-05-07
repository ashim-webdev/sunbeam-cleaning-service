import { useState } from 'react';
import ProfileInfo from './ProfileInfo';
import { motion, AnimatePresence } from 'framer-motion';
import { getInitials } from "../../utils/index";
import { Badge } from "../../components/ui/badge";
import { useDispatch, useSelector } from "react-redux";
import { 
  UserPen,
  User,
  MailCheck,
  X,
  Trash2
} from 'lucide-react';
import LinearSocial from '../LinearSocial';
import ModalWrapper from '../ModalWrapper';
import AddUser from '../AddUser';
import Button from '../Button';
import ConfirmationDialog from '../ConfirmationDialog';
import ProfileCard from './ProfileCard';



const ViewUserProfile = ({ 
  open, 
  setOpen, 
  profileSelected, 
  openDialog, 
  setOpenDialog, 
  deleteHandler 
}) => {
  const { LightMode }  = useSelector((state) => state.auth);
  const [openEdit, setOpenEdit] = useState(false);
  const [selected, setSelected] = useState(null);


  const deleteClick = (id) => {
    console.log(setOpenDialog)
    setSelected(id);
    setOpenDialog(true);
  };

  const editClick = (el) => {
    // console.log(el)
    setSelected(el);
    setOpenEdit(true);
  };

  return (
    <ModalWrapper open={open} openDialog={openDialog} setOpenDialog={setOpenDialog} setOpen={setOpen} profile={true}>
      <div className='w-full flex md:flex-row flex-col justify-center items-center gap-10 '>
        <ProfileCard onClick={(e) => e.stopPropagation()} profileSelected={profileSelected} setOpen={setOpen} editClick={editClick} deleteClick={deleteClick} componentType="ViewUserProfile" />

        <div onClick={(e) => e.stopPropagation()} className='bg-blue-400/70 backdrop-blur-[2px] border border-blue-200/30 shadow-[0_8px_32px_rgba(0,0,0,0.25)] w-90 sm:w-120 h-full px-2 py-4 rounded-lg'>
          <ProfileInfo userProfileData={profileSelected}/>
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
          key={new Date().getTime().toString()}
        />
      </div>
    </ModalWrapper>
  )
}

export default ViewUserProfile;