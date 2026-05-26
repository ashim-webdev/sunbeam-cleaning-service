import { useState, useEffect } from 'react';
import { socket } from "../socket";
import { useSelector } from "react-redux";
import {
  useGetAllLeavesQuery,
  useGetMyLeavesQuery,
} from "../redux/slices/api/leaveApiSlice";
import { LeaveForm } from '../components/LeaveComponent/LeaveForm';
import { LeaveList } from '../components/LeaveComponent/LeaveList';
import { LeaveDetailModal } from '../components/LeaveComponent/LeaveDetailModal';
import Loading from "../components/Loading"
import { Briefcase } from 'lucide-react';


const LeaveRequest = () => {
  const { LightMode } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.auth);

  const [selectedRequest, setSelectedRequest] = useState(null);


  const {
    data: adminLeaves = [],
    isLoading: adminLoading,
    refetch: refetchAdminLeaves,
  } = useGetAllLeavesQuery(undefined, {
    skip: !user?.isAdmin,
  });

  const {
    data: employeeLeaves = [],
    isLoading: employeeLoading,
    refetch: refetchEmployeeLeaves,
  } = useGetMyLeavesQuery(undefined, {
    skip: user?.isAdmin,
  });

  // console.log(employeeLeaves)

  const requests = user?.isAdmin ? adminLeaves : employeeLeaves;



  // Make slide bar disappear when modal is open
  useEffect(() => {
    document.body.classList.toggle("overflow-hidden", selectedRequest !== null);
  }, [selectedRequest]);


  // Listen for real-time updates to leave requests
  useEffect(() => {

    socket.on("leaveCreated", (data) => {

      console.log("Leave created:", data);

      if (user?.isAdmin) {
        refetchAdminLeaves();
      } else {
        refetchEmployeeLeaves();
      }
    });

    return () => {
      socket.off("leaveCreated");
    };

  }, [
    user,
    refetchAdminLeaves,
    refetchEmployeeLeaves,
  ]);

  // Listen for real-time updates to leave requests
  useEffect(() => {
    socket.on("leaveUpdated", (data) => {
      console.log("Leave updated:", data);

      if (user?.isAdmin) {
        refetchAdminLeaves();
      } else {
        refetchEmployeeLeaves();
      }
    });

    return () => {
      socket.off("leaveUpdated");
    };
  }, [
    user,
    refetchAdminLeaves,
    refetchEmployeeLeaves,
  ]);

  // console.log(selectedRequest)

  const handleRequestClick = (request) => {
    setSelectedRequest(request);
  };

  const handleCloseModal = () => {
    setSelectedRequest(null);
  };

  if (adminLoading || employeeLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loading />
      </div>
    );
  }

  return (
    <div className={`${LightMode ? "bg-white/60 shadow-darkSM" : "bg-black/60 "} h-full bg-linear-to-br transition-colors duration-300 ease-in-out rounded-2xl`}>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8 text-center">
          <div className="flex justify-center items-center mb-1">
            <h1 className={`flex justify-center items-center gap-3 text-[25px] md:text-3xl line-clamp-1 font-bold ${LightMode ? "text-black" : "text-white"} w-fit transition-colors whitespace-nowrap duration-300 ease-in-out`}>
              <Briefcase className="text-blue-600 md:hidden" size={35} /> 
              <Briefcase className="text-blue-600 hidden md:block" size={40} /> 
              <span>Leave Management</span>
            </h1>
          </div>
          <p className={`${LightMode ? "text-gray-600" : "text-gray-400"}`}>
            {user?.isAdmin
              ? 'Review and manage employee leave requests'
              : 'Submit and track your leave requests'}
          </p>
        </div>

        <div className="px-3">
          <div className={`w-full h-0.5 bg-linear-to-l from-blue-400/10 via-blue-500 to-blue-400/10  ${user?.isAdmin ? "mb-7 -mt-3" : "mb-8 -mt-2"}`} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {!user?.isAdmin && (
            <div className="lg:col-span-1 flex justify-center items-center">
              <LeaveForm />
            </div>
          )}

          <div className={user?.isAdmin ? 'lg:col-span-2' : ''}>
            <LeaveList
              requests={requests}
              isAdmin={user?.isAdmin}
              onRequestClick={handleRequestClick}
            />
          </div>
        </div>

        {selectedRequest && (
          <LeaveDetailModal
            request={selectedRequest}
            isAdmin={user?.isAdmin}
            onClose={handleCloseModal}
          />
        )}
      </div>
    </div>
  );
}

export default LeaveRequest;
