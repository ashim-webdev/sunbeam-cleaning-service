import clsx from "clsx";
import { useState, useEffect } from "react";
import { Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useCreateLeaveMutation } from "../../redux/slices/api/leaveApiSlice";
import { toast } from "sonner";
import DatePicker from "react-datepicker";





export function LeaveForm() {
  const { LightMode } = useSelector((state) => state.auth);
  const [createLeave] = useCreateLeaveMutation();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shake, setShake] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();


  // Calender "withPortal" Screen Sizing
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 600);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);
  // End

  // Shake animation trigger
  const handleErrorAnimation = () => {
    setShake(true);

    if (navigator.vibrate) {
      navigator.vibrate(300);
    }
    
    setTimeout(() => {
      setShake(false);
    }, 1000);
  };

  // Form Error Handler
  const onError = (errors) => {
    handleErrorAnimation();

    if (errors.reason && errors.description) {
      toast.error("Please fill in all required fields");
    } else if (errors.reason) {
      toast.error("Reason for leave is required");
    } else if (errors.description) {
      toast.error("Detailed description is required");
    }
  };

  // Date validation
  const validateDates = () => {
    if (!startDate || !endDate) {
      toast.error("Start and end dates are required");
      handleErrorAnimation();
      return false;
    }

    if (endDate < startDate) {
      toast.error("End date cannot be before start date");
      handleErrorAnimation();
      return false;
    }

    return true;
  };

  // Submit Handler
  const submitHandler = async (data) => {
    // console.log("Form Data:", data);
    setIsSubmitting(true);

    if (!validateDates()) {
      setIsSubmitting(false);
      return;
    }

    try {
      await createLeave({
        reason: data.reason,
        description: data.description,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      }).unwrap();

      reset();

      setStartDate(null);
      setEndDate(null);

      toast.success("Leave request submitted successfully");

    } catch (error) {
      toast.error(error?.data?.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };
  

  // Calculate duration based on selected dates
  const calculatedDuration =
    startDate && endDate
      ? Math.ceil(
          (endDate - startDate) /
            (1000 * 60 * 60 * 24)
        ) + 1
      : 0;


  const text = LightMode ? "text-black" : "text-white";

  const placeholder = LightMode
    ? "placeholder:text-gray-500"
    : "placeholder:text-gray-400";

  return (
    <div className={`${LightMode ? "bg-white shadow-darkSM" : "bg-black/90 shadow-lightSM"} w-full rounded-lg p-6 transition-colors duration-300 ease-in-out`}>
      <h2 className={`text-2xl font-semibold ${LightMode ? "text-black" : "text-white"} mb-6 transition-colors duration-300 ease-in-out`}>
        Request Leave
      </h2>

      <form
        onSubmit={handleSubmit(submitHandler, onError)}
        className="space-y-4"
      >
        {/* Reason */}
        <div>
          <label className={`block text-sm font-medium ${LightMode ? "text-black/80" : "text-white/80"} mb-1 transition-colors duration-300 ease-in-out`}>
            Reason for Leave
          </label>
          <input
            type="text"
            placeholder="e.g., Personal matters, Medical appointment"
            {...register("reason", {
              required: "Reason is required",
            })}
            className={`${LightMode ? "placeholder-black/40 text-black" : "placeholder-white/40 text-white"} w-full px-4 py-2 border rounded-md outline-0 transition-all duration-300 ease-in-out ${
              errors.reason
                ? `border-2 border-red-500 focus:border-red-500 ${
                    shake ? "animate-shake" : ""
                  }`
                : "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            }`}
            
          />
          {errors.reason && (
            <p className="text-red-500 text-sm mt-1 italic">
              {errors.reason.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">

          <div>
            <label className={`block text-sm font-medium ${LightMode ? "text-black/80" : "text-white/80"} mb-1 transition-colors duration-300 ease-in-out`}>
              Start Date
            </label>

            <div className="relative">
              <DatePicker
                selected={startDate}
                onChange={(date) => {
                  setStartDate(date);
                }}
                dateFormat="dd/MM/yyyy"
                placeholderText="start date"
                withPortal={isMobile}
                minDate={new Date()}
                calendarClassName={clsx(
                  LightMode
                    ? "light-calendar"
                    : "dark-calendar"
                )}
                className={`w-full ${text} ${placeholder} px-3 py-2 border rounded-md outline-0 transition-all duration-50 ease-in-out ${
                  !startDate && shake
                    ? "border-2 border-red-500 animate-shake"
                    : "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                }`}
              />
              <i className={`
                ${LightMode ? "text-black/50" : "text-white/50"}
                fa-solid fa-calendar sm:text-xl text-lg absolute top-2.75 [@media(min-width:500px)_and_(max-width:767px)]:right-4 right-2 shadow-2xl transition-all duration-300 ease-in-out
              `}></i>
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium ${LightMode ? "text-black/80" : "text-white/80"} mb-1 transition-colors duration-300 ease-in-out`}>
              End Date
            </label>

            <div className="relative">
              <DatePicker
                selected={endDate}
                onChange={(date) => {
                  setEndDate(date);
                }}
                dateFormat="dd/MM/yyyy"
                placeholderText="end date"
                withPortal={isMobile}
                minDate={startDate || new Date()}
                minTime={
                  startDate && endDate && startDate.toDateString() === endDate.toDateString()
                    ? startDate
                    : new Date(0, 0, 0, 0, 0)
                }
                maxTime={new Date(0, 0, 0, 23, 45)}
                calendarClassName={clsx(
                  LightMode
                    ? "light-calendar"
                    : "dark-calendar"
                )}
                className={`w-full ${text} ${placeholder} px-3 py-2 border rounded-md outline-0 transition-all duration-50 ease-in-out ${
                  !endDate && shake
                    ? "border-2 border-red-500 animate-shake"
                    : "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                }`}
              />
              <i className={`
                ${LightMode ? "text-black/50" : "text-white/50"}
                fa-solid fa-calendar sm:text-xl text-lg absolute top-2.75 [@media(min-width:500px)_and_(max-width:767px)]:right-4 right-2 shadow-2xl transition-all duration-300 ease-in-out
              `}></i>
              </div>
          </div>

        </div>

        {/* Duration */}
        <div>
          <label
            className={`block text-sm font-medium ${
              LightMode ? "text-black/80" : "text-white/80"
            } mb-1 transition-colors duration-300 ease-in-out`}
          >
            Duration (days)
          </label>

          <div
            className={`w-full px-4 py-2 rounded-md border transition-all duration-300 ease-in-out ${
              LightMode
                ? "bg-gray-100 text-black border-gray-300"
                : "bg-zinc-900 text-white border-gray-700"
            }`}
          >
            {calculatedDuration > 0
              ? `${calculatedDuration} day${
                  calculatedDuration > 1 ? "s" : ""
                }`
              : "Select start and end dates"}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className={`block text-sm font-medium ${LightMode ? "text-black/80" : "text-white/80"} mb-1 transition-colors duration-300 ease-in-out`}>
            Detailed Description
          </label>
          <textarea
            rows={4}
            placeholder="Provide detailed information about your leave request"
            {...register("description", {
              required: "Description is required",
            })}
            className={`${LightMode ? "placeholder-black/40 text-black" : "placeholder-white/40 text-white"} w-full px-4 py-2 border rounded-md resize-none outline-0 transition-all duration-300 ease-in-out ${
              errors.description
                ? `border-2 border-red-500 focus:border-red-500 ${
                    shake ? "animate-shake" : ""
                  }`
                : "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            }`}
          />
          {errors.description && (
            <p className="text-red-500 text-sm -mt-0.5 italic">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`ClickAnimationNoti w-full mt-6 shadow-inner  font-semibold py-3 px-6 rounded-md transition-all duration-200 flex items-center justify-center gap-2 text-white ${
            shake
              ? "bg-red-500 hover:bg-red-500 animate-shake"
              : "bg-blue-600 hover:bg-blue-700"
          } ${isSubmitting ? "opacity-60 cursor-not-allowed" : ""}`}
        >
          {isSubmitting ? (
            "Submitting..."
          ) : (
            <>
              <Send size={18} />
              Submit Request
            </>
          )}
        </button>
      </form>
    </div>
  );
}