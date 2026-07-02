import { AnimatePresence, motion } from "framer-motion";
import { TriangleAlert } from "lucide-react";



export default function EmployeeLoginModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const handleBooking = () => {
    onClose();

    const booking = document.getElementById("booking form");

    if (booking) {
      booking.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const handleEmployee = () => {
    window.location.href = "/log-in";
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] flex items-center justify-center px-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl"
        >
          <div className="text-center">

            <div className="w-20 h-20 mx-auto rounded-full bg-red-100 flex items-center justify-center mb-5">
              <TriangleAlert size={50} className="text-red-500" />
            </div>

            <h2 className="text-2xl font-bold text-slate-800">
              Employee Login
            </h2>

            <p className="text-slate-600 mt-4 leading-7">
              This sign in page is reserved for
              <span className="font-semibold">
                {" "}authorized employees and administrators{" "}
              </span>
              of Sunbeam Cleaning Services.
            </p>

            <p className="text-slate-600 mt-3">
              If you're looking to book a cleaning service,
              simply continue to our booking form below.
            </p>

            <div className="mt-8 flex flex-col gap-3">

              <button
                onClick={handleBooking}
                className="cursor-pointer w-full py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
              >
                Book a Cleaning
              </button>

              <button
                onClick={handleEmployee}
                className="cursor-pointer w-full py-3 rounded-xl border border-slate-300 font-semibold hover:bg-slate-100 transition"
              >
                I'm an Employee
              </button>

              <button
                onClick={onClose}
                className="cursor-pointer text-slate-500 hover:text-black mt-2"
              >
                Cancel
              </button>

            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}