import { useState } from "react";
import { Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { toast } from "sonner";

export function LeaveForm({ userEmail, onSubmitSuccess }) {
  const { LightMode } = useSelector((state) => state.auth);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shake, setShake] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

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

    if (errors.reason && errors.duration && errors.description) {
      toast.error("Please fill in all required fields");
    } else if (errors.reason) {
      toast.error("Reason for leave is required");
    } else if (errors.duration) {
      toast.error("Duration is required");
    } else if (errors.description) {
      toast.error("Detailed description is required");
    }
  };

  // Submit Handler
  const submitHandler = (data) => {
    setIsSubmitting(true);

    const durationNum = parseInt(data.duration);

    if (durationNum <= 0) {
      toast.error("Duration must be greater than 0");
      handleErrorAnimation();
      setIsSubmitting(false);
      return;
    }

    const id = crypto.randomUUID();

    setTimeout(() => {
      const newRequest = {
        id: id,
        user_email: userEmail,
        reason: data.reason,
        duration: durationNum,
        description: data.description,
        status: "pending",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      reset();
      onSubmitSuccess(newRequest);
      setIsSubmitting(false);
      toast.success("Leave request submitted successfully");
    }, 300);
  };

  return (
    <div className={`${LightMode ? "bg-white shadow-darkSM" : "bg-black/90 shadow-lightSM"} rounded-lg p-6 transition-colors duration-300 ease-in-out`}>
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

        {/* Duration */}
        <div>
          <label className={`block text-sm font-medium ${LightMode ? "text-black/80" : "text-white/80"} mb-1 transition-colors duration-300 ease-in-out`}>
            Duration (days)
          </label>
          <input
            type="number"
            min="1"
            placeholder="Number of days"
            {...register("duration", {
              required: "Duration is required",
            })}
            className={`${LightMode ? "placeholder-black/40 text-black" : "placeholder-white/40 text-white"}  w-full px-4 py-2 border rounded-md outline-0 transition-all duration-300 ease-in-out ${
              errors.duration
                ? `border-2 border-red-500 focus:border-red-500 ${
                    shake ? "animate-shake" : ""
                  }`
                : "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            }`}
          />
          {errors.duration && (
            <p className="text-red-500 text-sm mt-1 italic">
              {errors.duration.message}
            </p>
          )}
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