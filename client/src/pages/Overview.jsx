import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useDeleteUserMutation
} from "../redux/slices/api/userApiSlice";
import { toast } from "sonner";
import AppAreaChart from "../components/OverviewComponents/AppAreaChart";
import AppBarChart from "../components/OverviewComponents/AppBarChart";
import AppPieChart from "../components/OverviewComponents/AppPieChart";
import CardList from "../components/OverviewComponents/CardList";
import ViewUserProfile from "../components/ProfileComponents/viewUserProfile";
import ConfirmationDialog from "../components/ConfirmationDialog";
import ProfileCard from "../components/ProfileComponents/ProfileCard";
import AddUser from "../components/AddUser";
import BookingAnalytics from "../components/OverviewComponents/BookingAnalytics"; 

const Overview = () => {
  const { LightMode, selectedUserInfo, selectedUserId, userViewInfo } = useSelector((state) => state.auth);

  const [deleteUser] = useDeleteUserMutation();

  const selectedUser = selectedUserInfo
  
  // console.log("selectedUser",selectedUser, "selectedId", selectedUserId)

  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selected, setSelected] = useState(null)

  const openInfoClick = (el) => {
    setOpen(true);
  };

  const deleteClick = (id) => {
    setSelected(id)
    setOpenDialog(true);
  };

  const editClick = (id) => {
    setSelected(id)
    setOpenEdit(true);
  };


  const deleteHandler = async () => {
    try {
      const res = await deleteUser(selected);

      toast.success(res?.data?.message);

      setOpenDialog(false);
      setSelected(null);
      setOpen(false)

    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };



  const bg = LightMode ? "bg-primary-foreground" : "bg-black/90"
  const changeAnimation = "transition-all duration-300 ease-in-out"
  const areaChartBg = LightMode ? "bg-blue-600/40" : "bg-blue-600/20"
  
  
  return (
    <div className="flex flex-col gap-4 mb-4 h-auto w-full overflow-x-hidden">
      <div className={`${bg} ${changeAnimation} w-full h-full flex justify-center items-center py-4 rounded-lg col-span-1 overflow-hidden`}>
        <BookingAnalytics />
      </div>

      <div className="px-12 -mb-1.5 w-full flex justify-center items-center">
        <div className={`${LightMode ? "bg-linear-to-l from-green-400/10 via-green-600 to-green-400/10" : "bg-linear-to-l from-white/30 via-white to-white/10"} w-full h-0.5`} />
      </div>

      <div className="p-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-2 gap-4">
        <div className={`${bg} ${changeAnimation} w-full h-full px-4 pt-6 pb-4 rounded-lg col-span-1 overflow-hidden`}>
          <AppBarChart />
        </div>
        <div className={`${bg} ${changeAnimation} w-full h-full px-4 pt-6 pb-4 rounded-lg col-span-1 overflow-hidden`}>
          <AppPieChart />
        </div>
      </div>

      <div className="px-12 -mt-1 mb-1.5 w-full flex justify-center items-center">
        <div className={`${LightMode ? "bg-linear-to-l from-green-400/10 via-green-600 to-green-400/10" : "bg-linear-to-l from-white/30 via-white to-white/10"} w-full h-0.5`} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-2 gap-4 w-full">
        <div className={`${bg} ${changeAnimation}  flex justify-center items-center w-full h-full rounded-lg col-span-1 md:row-span-2 `}>
          <div className="relative w-full flex flex-col justify-center items-center gap-4">
            <div className=" grid-cols-1 w-full h-full px-4 pt-6 pb-6 rounded-lg">
              <CardList title="Employee's List" subtitle="Click to view employee stats" />
            </div>
            
            <div className="absolute hidden sm:flex top-175 w-full justify-center items-center px-20">
              <div className=' bg-blue-600 w-2 h-2 px-1 rounded-full whitespace-nowrap shadow-inner' />

              <div className="w-full h-0.5 bg-linear-to-l from-blue-400/10 via-blue-600 to-blue-400/10 m-1" />

              <div className=' bg-blue-600 w-2 h-2 px-1 rounded-full whitespace-nowrap shadow-inner' />
            </div>

            

            <div className="flex justify-center items-center w-full h-full px-4 pt-5 pb-4 rounded-lg">
              <ProfileCard header="Employee's Profile" componentType="Profile Overview" onClick={(e) => e.stopPropagation()} profileSelected={selectedUser} editClick={editClick} deleteClick={deleteClick} setOpen={setOpen}  />
            </div>
          </div>
        </div>

        <div className={`${areaChartBg} backdrop-blur-[2px] border border-blue-200/30 shadow-lg shadow-blue-500/20 h-full py-4 px-4 pt-6 pb-4 rounded-lg col-span-1`}>
          <AppAreaChart />
        </div>

        <div className={`${bg} ${changeAnimation} relative h-full px-8 pt-6 pb-4 rounded-lg col-span-1`}>
          <CardList title="Employee Leave Requests" subtitle="Click to view employee stats" />

          <div className="absolute -top-2.5 right-0 left-0 px-12 w-full flex justify-center items-center">
            <div className={`w-full h-0.5 ${LightMode ? "bg-linear-to-l from-green-400/10 via-green-600 to-green-400/10" : "bg-linear-to-l from-white/30 via-white to-white/10"} `} />
        </div>
        </div>
      </div>


      <div className="px-12 mt-1.5 mb-1.5 w-full flex justify-center items-center">
        <div className={`w-full h-0.5 ${LightMode ? "bg-linear-to-l from-green-400/10 via-green-600 to-green-400/10" : "bg-linear-to-l from-white/30 via-white to-white/10"} `} />
      </div>


      <div className={`${bg} ${changeAnimation} h-fit px-4 pt-6 pb-4 rounded-lg`}>
        <CardList 
          title="Active Employee's" 
          openInfoClick={openInfoClick}
          open={open}
          setOpen={setOpen}
        />
      </div>

      <ConfirmationDialog
        open={openDialog}
        setOpen={setOpenDialog}
        onClick={deleteHandler}
      />

      <AddUser
        open={openEdit}
        setOpen={setOpenEdit}
        userData={selectedUser}
      />

      <ViewUserProfile 
        open={open}
        setOpen={setOpen}
        profileSelected={userViewInfo}
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        deleteHandler={deleteHandler}
        setSelected = {setSelected}
        selected = {selected}
      />
    </div>
  );
};

export default Overview;
