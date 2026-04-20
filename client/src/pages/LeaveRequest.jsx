import { useState, useEffect } from 'react';
// import { LeaveRequest } from './lib/supabase';
import { useSelector } from "react-redux";
import { RoleToggle } from '../components/LeaveComponent/RoleToggle';
import { LeaveForm } from '../components/LeaveComponent/LeaveForm';
import { LeaveList } from '../components/LeaveComponent/LeaveList';
import { LeaveDetailModal } from '../components/LeaveComponent/LeaveDetailModal';
import { Briefcase } from 'lucide-react';

const LeaveRequest = () => {
  const { LightMode } = useSelector((state) => state.auth);
  
  const [isAdmin, setIsAdmin] = useState(false);
  const [userEmail, setUserEmail] = useState('ashimgab@gmail.com');
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);

  // Make slide bar disappear when modal is open
  useEffect(() => {
    document.body.classList.toggle("overflow-hidden", selectedRequest !== null);
  }, [selectedRequest]);


  const handleToggleRole = () => {
    setIsAdmin(!isAdmin);
  };

  const handleSubmitRequest = (newRequest) => {
    setRequests([newRequest, ...requests]);
  };

  const handleRequestClick = (request) => {
    setSelectedRequest(request);
  };

  const handleCloseModal = () => {
    setSelectedRequest(null);
  };

  const handleUpdateRequest = (updatedRequest) => {
    setRequests(requests.map(req => req.id === updatedRequest.id ? updatedRequest : req));
    setSelectedRequest(updatedRequest);
  };

  return (
    <div className={`${LightMode ? "bg-white/60 shadow-darkSM" : "bg-black/60 shadow-lightSM"} h-full bg-linear-to-br transition-colors duration-300 ease-in-out`}>
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
            {isAdmin
              ? 'Review and manage employee leave requests'
              : 'Submit and track your leave requests'}
          </p>
        </div>

        <RoleToggle
          isAdmin={isAdmin}
          onToggle={handleToggleRole}
          userEmail={userEmail}
          onEmailChange={setUserEmail}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {!isAdmin && (
            <div>
              <LeaveForm userEmail={userEmail} onSubmitSuccess={handleSubmitRequest} />
            </div>
          )}

          <div className={isAdmin ? 'lg:col-span-2' : ''}>
            <LeaveList
              requests={requests}
              isAdmin={isAdmin}
              userEmail={userEmail}
              onRequestClick={handleRequestClick}
            />
          </div>
        </div>

        {selectedRequest && (
          <LeaveDetailModal
            request={selectedRequest}
            isAdmin={isAdmin}
            onClose={handleCloseModal}
            onUpdate={handleUpdateRequest}
          />
        )}
      </div>
    </div>
  );
}

export default LeaveRequest;
