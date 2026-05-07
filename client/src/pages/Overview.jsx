import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AppAreaChart from "../components/OverviewComponents/AppAreaChart";
import AppBarChart from "../components/OverviewComponents/AppBarChart";
import AppPieChart from "../components/OverviewComponents/AppPieChart";
import CardList from "../components/OverviewComponents/CardList";
import ViewUserProfile from "../components/ProfileComponents/viewUserProfile";
import ConfirmationDialog from "../components/ConfirmationDialog";
import ProfileCard from "../components/ProfileComponents/ProfileCard";
import AddUser from "../components/AddUser";

const Overview = () => {
  const { LightMode } = useSelector((state) => state.auth);
  
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selected, setSelected] = useState(null);


  const openInfoClick = (el) => {
    console.log(el)
    setSelected(el);
    setOpen(true);
  };

  const deleteClick = (id) => {
    // console.log(setOpenDialog)
    setSelected(id);
    setOpenDialog(true);
  };

  const editClick = (el) => {
    // console.log(el)
    setSelected(el);
    setOpenEdit(true);
  };

  const bg = LightMode ? "bg-primary-foreground" : "bg-black/90"
  const changeAnimation = "transition-all duration-300 ease-in-out"
  const areaChartBg = LightMode ? "bg-blue-600/40" : "bg-blue-600/20"
  
  
  return (
    <div className="flex flex-col gap-4 mb-4 h-auto w-full overflow-x-hidden">
      <div className="p-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-2 gap-4">
        <div className={`${bg} ${changeAnimation} w-full h-full px-4 pt-6 pb-2 rounded-lg col-span-1`}>
          <AppBarChart />
        </div>
        <div className={`${bg} ${changeAnimation} w-full h-full px-4 pt-6 pb-2 rounded-lg col-span-1`}>
          <AppPieChart />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-2 gap-4 w-full">
        <div className={`${bg} ${changeAnimation}  flex justify-center items-center w-full h-full rounded-lg col-span-1 md:row-span-2 `}>
          <div className="relative w-full flex flex-col justify-center items-center gap-4">
            <div className=" grid-cols-1 w-full h-full px-4 pt-6 pb-6 rounded-lg">
              <CardList title="Employee's List" subtitle="Click to view employee stats" />
            </div>
            
            <span className="absolute top-154  w-full px-10">
              <div className="w-full h-0.5 bg-linear-to-l from-blue-400/10 via-blue-500 to-blue-400/10 m-1" />
            </span>

            <div className="flex justify-center items-center w-full h-full px-4 pt-10 pb-2 rounded-lg">
              <ProfileCard header="Employee's Profile" componentType="Profile Overview" onClick={(e) => e.stopPropagation()} profileSelected={selected} editClick={editClick} deleteClick={deleteClick} setOpen={setOpen}  />
            </div>
          </div>
        </div>
        <div className={`${areaChartBg} backdrop-blur-[2px] border border-blue-200/30 shadow-lg shadow-blue-500/20 h-full py-4 px-4 pt-6 pb-2  rounded-lg col-span-1`}>
          <AppAreaChart />
        </div>
        <div className={`${bg} ${changeAnimation} h-full px-4 pt-6 pb-2 rounded-lg col-span-1`}>
          <CardList title="Employee Leave Requests" subtitle="Click to view employee stats" />
        </div>
      </div>


      <div className={`${bg} ${changeAnimation} h-fit px-4 pt-6 pb-2 rounded-lg`}>
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
      />

      <AddUser
        open={openEdit}
        setOpen={setOpenEdit}
        userData={selected}
        key={new Date().getTime().toString()}
      />

      <ViewUserProfile 
        open={open}
        setOpen={setOpen}
        profileSelected={selected}
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
      />
    </div>
  );
};

export default Overview;
