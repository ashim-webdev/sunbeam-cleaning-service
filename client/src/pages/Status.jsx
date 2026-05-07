import { useState } from "react";
import CardList from "../components/OverviewComponents/CardList";
import ViewUserProfile from "../components/ProfileComponents/viewUserProfile";
import { useDispatch, useSelector } from "react-redux";

const Status = () => {
  const { LightMode } = useSelector((state) => state.auth);
  
  const [open, setOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selected, setSelected] = useState(null);


  const openInfoClick = (el) => {
    console.log(el)
    setSelected(el);
    setOpen(true);
  };

  const bg = LightMode ? "bg-primary-foreground" : "bg-black/90"
  const changeAnimation = "transition-all duration-300 ease-in-out"

  return (
    <div className="flex flex-col lg:flex-row justify-center items-center gap-5 mb-4 h-auto w-full overflow-x-hidden mt-6">
      <div className={`${bg} ${changeAnimation} w-full h-fit px-4 pt-6 pb-2 rounded-lg`}>
        <CardList 
          title="Active Employee's" 
          openInfoClick={openInfoClick}
          open={open}
          setOpen={setOpen}
        />
      </div>

      <div className={`${bg} ${changeAnimation} w-full h-fit px-4 pt-6 pb-2 rounded-lg`}>
        <CardList 
          title="Disabled Employee's" 
          openInfoClick={openInfoClick}
          open={open}
          setOpen={setOpen}
        />
      </div>

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

export default Status;
