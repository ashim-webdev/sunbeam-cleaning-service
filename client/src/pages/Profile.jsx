import React from 'react'
import { useState, useEffect } from 'react';
import ProfileInfo from '../components/ProfileComponents/ProfileInfo';
import { motion, AnimatePresence } from 'framer-motion';
import { getInitials } from "../utils/index";
import { Badge } from "../components/ui/badge";
import { useDispatch, useSelector } from "react-redux";
import {useGetUserProfileQuery} from "../redux/slices/api/userApiSlice"
import { 
  UserPen,
  User,
  MailCheck
} from 'lucide-react';
import LinearSocial from '../components/LinearSocial';
import Button from '../components/Button';
import ProfileCard from '../components/ProfileComponents/ProfileCard';
import ConfirmationDialog from '../components/ConfirmationDialog';
import AddUser from '../components/AddUser';

const Profile = () => {
  const { LightMode, CPEditPopUp }  = useSelector((state) => state.auth);

  const { data: freshUser } = useGetUserProfileQuery();
  

  const [openEdit, setOpenEdit] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selected, setSelected] = useState(null);

  

  const userProfileData = freshUser;

  const editClick = (el) => {
    // console.log(el)
    setSelected(el);
    setOpenEdit(true);
  };

  useEffect(() => {
    if (CPEditPopUp === true) {
      editClick(userProfileData)
    }
  }, [CPEditPopUp])

  return (
    <div className='w-full flex md:flex-row flex-col justify-center items-center gap-10 '>
      <ProfileCard onClick={(e) => e.stopPropagation()} profileSelected={userProfileData} editClick={editClick} componentType="Profile" />

      <div className='bg-blue-400/20 backdrop-blur-[2px] border border-blue-200/30 shadow-[0_8px_32px_rgba(0,0,0,0.25)] w-90 sm:w-120 h-full px-2 py-4 rounded-lg'>
        <ProfileInfo userProfileData={userProfileData}/>
      </div>

      <AddUser
        open={openEdit || CPEditPopUp}
        setOpen={setOpenEdit}
        userData={selected}
      />
    </div>
  )
}

export default Profile;