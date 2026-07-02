// Admin.jsx
import { useState, useEffect } from "react";
import { socket } from "../socket";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Calendar,
  Phone,
  MapPin,
  Store,
  ExternalLink,
  ChevronsUp,
  ChevronDown,
  Download
} from "lucide-react";
import { HiDuplicate } from "react-icons/hi";
import { useSelector } from "react-redux";
import { useParams, useSearchParams } from "react-router-dom";
import {
  useGetBookingsQuery,
  useUpdateBookingMutation,
  useDeleteBookingMutation,
} from "../redux/slices/api/bookingApiSlice";
import Loading from "../components/Loading"
import EditBtn from "../components/EditBtn";
import DeleteBtn from "../components/DeleteBtn";
import ConfirmationDialog from "../components/ConfirmationDialog";
import EditBookingForm from "../components/EditBookingForm";
import Pagination from "../components/Pagination";




export default function Bookings() {
  const { LightMode } = useSelector((state) => state.auth);

  const [openBookingId, setOpenBookingId] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openEditForm, setOpenEditForm] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [copiedBookingId, setCopiedBookingId] = useState(null);
  
  const [page, setPage] = useState(1);

  const [searchParams] = useSearchParams();

  const search = searchParams.get("search") || "";

  const { data, isLoading, refetch } =
    useGetBookingsQuery({
      page,
      limit: 10,
      search,
    });

  // Update Booking
  const [updateBooking, { isLoading: updating }] =
  useUpdateBookingMutation();

  // Delete Booking
  const [deleteBooking, { isLoading: deleting }] =
  useDeleteBookingMutation();


  const bookings = data?.bookings || [];
  const totalPages = data?.totalPages || 1;
  const totalBookings = data?.totalBookings || 0;


  const deleteClicks = (booking) => {
    setSelectedBooking(booking);
    setOpenDialog(true);
  };

  const editClickHandler = (booking) => {
    setSelectedBooking(booking);
    setOpenEditForm(true);
  };


  const deleteHandler = async () => {
    try {
      await deleteBooking(
        selectedBooking._id
      ).unwrap();
      toast.success("Booking deleted successfully");

      setOpenDialog(false);

    } catch (error) {
      console.log(error);
      toast.error(error?.data?.message || "Failed to delete booking");
    }
  };


  // Download images function
  const downloadImage = async (imageUrl, index) => {
    try {
      const response = await fetch(imageUrl);

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;

      link.download = `booking-image-${index + 1}.jpg`;

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);

      toast.success("Image downloaded successfully");

    } catch (error) {
      console.error(error);

      toast.error("Failed to download image");
    }
  };


  // Reset to page 1 when search or status changes
  useEffect(() => {
    setPage(1);
  }, [search]);

  // Listen for real-time updates to bookings
  useEffect(() => {
    socket.on("bookingCreated", () => {
      refetch();
    });

    socket.on("bookingUpdated", () => {
      refetch();
    });

    socket.on("bookingDeleted", () => {
      refetch();
    });

    return () => {
      socket.off("bookingCreated");
      socket.off("bookingUpdated");
      socket.off("bookingDeleted");
    };
  }, [refetch]);


  const toggleSwitchArrow = (bookingId) => {
    setOpenBookingId((prev) =>
      prev === bookingId ? null : bookingId
    );
  };


  // Copy Address Feature Function
  const copyAddress = async (bookingId, address, e) => {
    e.stopPropagation();

    try {
      await navigator.clipboard.writeText(address);

      setCopiedBookingId(bookingId);

      toast.success("Copied successfully");

      setTimeout(() => {
        setCopiedBookingId(null);
      }, 2000);

    } catch (err) {
      console.error("Copy failed:", err);
      toast.error("Copy failed");
    }
  };


  const bgCon = LightMode
    ? "bg-white shadow-darkSM"
    : "bg-black/90 shadow-lightSM";

  const bgDlSh = LightMode
    ? "shadow-darkSM"
    : "shadow-lightSM";

  const subText = LightMode
    ? "text-black/80"
    : "text-white/80";

  const shadow = LightMode
    ? "shadow-darkSM"
    : "shadow-lightSM";

  const hoverShadow = LightMode
    ? "hover:shadow-dark"
    : "hover:shadow-light";

  const hoverSmallShadow = LightMode
    ? "hover:shadow-md hover:shadow-black/50"
    : "hover:shadow-md hover:shadow-white/50";

  const text = LightMode
    ? "text-black"
    : "text-white";

  const border = LightMode
    ? "border border-gray-200"
    : "border-2 border-gray-300";

  return isLoading ? (
    <Loading />
  ) : (
    <>
      <div
        key="Bookings"
        onClick={() => setOpenBookingId(null)}
        className="space-y-6 relative"
      >
        <div className={`flex items-center justify-between mt-4 mb-6 mx-4`}>
          <h2 className={`${text} text-2xl font-semibold flex justify-center item-center gap-2 transition-all duration-300 ease-in-out`}>Bookings <span className="hidden sm:block">Dashboard</span></h2>
          <span className={`${shadow} bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 ease-in-out`}>
            {totalBookings} Total Bookings
          </span>
        </div>

        {bookings.length === 0 ? (
          <>
            {search ? (
              <span className={`${LightMode ? "text-black/60" : "text-white/60"} w-full block text-center mt-20 p-2 text-lg animate-bounce transition-all duration-300 ease-in-out`}>
                {`No tasks found for "${search}" :(`}
              </span>
            ) : (
              <div className={`${bgCon} border border-dashed border-stone-300 rounded-2xl p-12 text-center transition-all duration-300 ease-in-out`}>
                <div className={`${shadow} bg-stone-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-black transition-all duration-300 ease-in-out`}>
                  <Calendar size={32} />
                </div>
                <h3 className={`${text} text-lg font-medium transition-all duration-300 ease-in-out`}>No bookings yet</h3>
                <p className={`${subText} transition-all duration-300 ease-in-out`}>New bookings will appear here as clients submit the form.</p>
              </div>
            )}
          </>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-4">
            <AnimatePresence mode="wait">
              {bookings.map((booking, index) => (
                <motion.div 
                  // key={`${page}-${search}-${status}`} // Refetch data when page, search, or status changes
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                  transition={{ duration: 0.8 }}
                  className="relative mt-4"
                >
                  <div className={`${bgCon} ${hoverSmallShadow} BookingCard border-t border-r border-blue-600 p-6 mx-1 rounded-2xl transition-all duration-300 ease-in-out overflow-hidden`}>
                    <div className="relative flex justify-between items-start mb-4">
                      <div>
                        <h3 className={`${text} mt-2 font-semibold text-lg line-clamp-1 transition-all duration-300 ease-in-out`}>{booking.clientName}</h3>
                        <p className={`${subText} text-sm flex items-center gap-1 transition-all duration-300 ease-in-out`}>
                          <Phone size={14} /> {booking.phoneNumber}
                        </p>
                      </div>
                      <span className={`${shadow} ${LightMode ? "bg-white text-black" : "bg-black text-white"} serviceStyle absolute -top-6 -right-6 border-l border-b border-blue-600  whitespace-nowrap px-2 py-1 line-clamp-1 rounded-bl-md text-xs font-medium transition-all duration-300 ease-in-out`}>
                        {booking.service}
                      </span>
                    </div>
                    
                    <div className="space-y-3">
                      <div className={`${subText} flex gap-2 text-sm transition-all duration-300 ease-in-out`}>
                        <MapPin size={16} className="shrink-0 mt-0.5 text-emerald-600" />
                        <p>{booking.address}</p>
                      </div>

                      <div className={`${subText} relative flex gap-2 text-sm transition-all duration-300 ease-in-out `}>
                        <Store size={16} className="shrink-0 mt-0.5 text-emerald-600" />
                        <p>{booking.property}</p>

                        {booking?.images?.length > 0 && (
                          <div className="absolute -top-1.5 right-0  flex justify-center items-center gap-2">
                            <div className="flex justify-center items-center">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation()
                                  toggleSwitchArrow(booking._id)
                                }}
                                className={`${text} cursor-pointer transition-all duration-300 ease-in-out`}
                              >
                                {openBookingId === booking._id ? 
                                  <ChevronsUp size={22} className="font-bold animate-UpDown" />
                                  : 
                                  <ChevronDown size={22} className="font-bold" />
                                }
                              </button>
                            </div>

                            <div 
                              onClick={(e) => {
                                e.stopPropagation()
                                toggleSwitchArrow(booking._id)
                              }}
                              className="flex items-center -space-x-3.5"
                            >
                              {booking?.images?.slice(0, 3).map((img, index) => (
                                <span className={`${LightMode ? "shadow-darkSM" : "shadow-lightSM"} w-8 h-8 flex justify-center items-center rounded-full text-white font-semibold  bg-blue-600 transition-all duration-300 ease-in-out`}>
                                  {img?.url && 
                                    <img
                                      key={index}
                                      src={img?.url}
                                      className={`${LightMode ? "border-blue-500" : "border-white"} w-8 h-8 rounded-full object-cover border-2 transition-all duration-300 ease-in-out`}
                                    />
                                  }
                                </span>
                              ))}

                              {booking?.images?.length > 3 && (
                                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-300 text-black text-xs font-semibold">
                                  +{booking?.images?.length - 3}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className={`${LightMode ? "text-stone-500 border-stone-300" : "text-stone-400  border-stone-100"} flex items-center gap-2 border-t text-xs pt-2 mt-4  transition-all duration-300 ease-in-out`}>
                        <Calendar size={14} />
                        <span>
                          Booked on{" "}
                          {new Date(booking.createdAt).toLocaleString("en-GB", {
                            year: "numeric",
                            month: "short",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })}
                        </span>
                      </div>

                      <a
                        href={`https://www.google.com/maps?q=${booking.lat},${booking.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${hoverShadow} BookingButton hover:scale-102 active:scale-95 w-full mt-4 flex items-center justify-center gap-2 py-2 px-4 bg-blue-600 text-white rounded-xl text-sm font-medium transition-all duration-300 ease-in-out`}
                      >
                        <ExternalLink size={14} />
                        Open in Google Maps
                      </a>


                      <div className='absolute -top-4.5 left-2.5 flex justify-center items-center gap-2 md:gap-3'>
                        <span className={`${bgCon} flex justify-center items-center rounded-full`}>
                          <EditBtn 
                            onClick={(e) => {
                              e.stopPropagation()
                              editClickHandler(booking)
                            }}
                          />
                        </span>
                        
                        <span className={`${bgCon} flex justify-center items-center rounded-full`}>
                          <DeleteBtn
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteClicks(booking)
                            }}
                          />
                        </span>

                        <span className={`${bgCon} ${LightMode ? "text-gray-500" : "text-gray-300"} p-2 flex justify-center items-center rounded-full transition-all duration-300 ease-in-out`}>
                          {copiedBookingId === booking?._id ? (
                            <i className="fa-solid fa-check-double bg-white p-0.5 rounded-full text-green-600 text-xl cursor-pointer hover:scale-110 transition-transform"></i>
                          ) : (
                            <HiDuplicate
                              title="Copy address"
                              onClick={(e) => copyAddress(booking?._id, booking?.address, e)}
                              className="rounded-full text-xl cursor-pointer hover:scale-110 transition-transform"
                            />
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {booking?.images?.length > 0 && (
                    <AnimatePresence>
                      {/* View Image Ui */}
                      {openBookingId === booking._id && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.2 }}
                          className={`${bgCon} ${hoverSmallShadow} shadow-lg absolute top-42 left-0 right-0 h-100 border border-blue-600 py-4 px-2 -mx-2 z-20 rounded-tl-2xl rounded-bl-2xl transition-all duration-300 ease-in-out overflow-y-auto overflow-x-hidden`}
                          >
                          <AnimatePresence>
                            {booking?.images?.map((img, index) => (
                              <motion.div 
                                key={index} 
                                initial={{ opacity: 0, x: 40 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -40 }}
                                transition={{
                                  duration: 0.6,
                                  delay: index * 0.2, // stagger effect
                                }}
                                className={`outline-0 border-2 relative flex justify-center overflow-hidden items-center gap-2 mb-3 w-full h-50 rounded-xl bg-blue-gray-500 bg-clip-border text-white`}
                              >
                              <span  className="text-white font-semibold">
                                {img?.url && 
                                  <img
                                    src={img?.url}
                                    className="h-full w-full object-cover"
                                  />
                                }
                                </span>

                                {/* Download individual image button */}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    downloadImage(img.url, index);
                                  }}
                                  className={`
                                    ${border}
                                    ${bgDlSh}
                                    text-white
                                    absolute
                                    top-2
                                    right-2
                                    z-10
                                    w-9
                                    h-9
                                    rounded-full
                                    bg-black/60
                                    backdrop-blur-sm
                                    flex
                                    items-center
                                    justify-center
                                    hover:scale-110
                                    active:scale-95
                                    transition-all
                                    duration-300
                                    ease-in-out
                                    cursor-pointer
                                  `}
                                >
                                  <Download size={18} />
                                </button>

                              </motion.div>
                            ))}
                          </AnimatePresence>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center">
          <span>
            <Pagination
              page={page}
              setPage={setPage}
              totalPages={totalPages}
            />
          </span>
        </div>
      )}

      <ConfirmationDialog
        open={openDialog}
        setOpen={setOpenDialog}
        onClick={deleteHandler}
        isLoading={deleting}
      />

      <EditBookingForm
        booking={selectedBooking}
        updateBooking={updateBooking}
        loading={updating}
        open={openEditForm}
        setOpen={setOpenEditForm}
      />
    </>

  );
}