import { useState } from "react";
import CardList from "../components/OverviewComponents/CardList";
import ViewUserProfile from "../components/ProfileComponents/viewUserProfile";
import AddUser from "../components/AddUser";
import ConfirmationDialog from "../components/ConfirmationDialog";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { useDeleteUserMutation } from "../redux/slices/api/userApiSlice";

const Status = () => {
  const { LightMode } = useSelector((state) => state.auth);

  const [deleteUser] = useDeleteUserMutation();
  
  const [open, setOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selected, setSelected] = useState(null);


  const openInfoClick = (el) => {
    setSelected(el);
    setOpen(true);
  };


  const deleteHandler = async () => {
    try {
      const res = await deleteUser(selected?._id);

      toast.success(res?.data?.message);

      setOpenDialog(false);
      setSelected(null);
      setOpen(false)

    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };


  const bg = LightMode ? "bg-primary-foreground" : "bg-black/90"
  const changeAnimation = "transition-all duration-300 ease-in-out"

  return (
    <div className="flex flex-col lg:flex-row justify-center items-center gap-5 mb-4 h-full w-full overflow-x-hidden mt-6">
      <div className={`${bg} ${changeAnimation} w-full h-fit px-4 pt-6 pb-4 rounded-lg`}>
        <CardList 
          title="Active Employee's" 
          openInfoClick={openInfoClick}
          open={open}
          setOpen={setOpen}
        />
      </div>

      <div className={`${bg} ${changeAnimation} w-full h-fit px-4 pt-6 pb-4 rounded-lg`}>
        <CardList 
          title="Disabled Employee's" 
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
        userData={selected}
      />

      <ViewUserProfile 
        open={open}
        setOpen={setOpen}
        profileSelected={selected}
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        deleteHandler={deleteHandler}
        setSelected = {setSelected}
        selected = {selected}
      />
    </div>
  );
};

export default Status;