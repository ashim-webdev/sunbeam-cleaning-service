import { Fragment, useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { Listbox, Transition } from "@headlessui/react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import {
  ChevronDown,
  ChevronsUp,
} from "lucide-react";

import Textbox from "./Textbox";
import ModalWrapper from "./ModalWrapper";






const LoadingSmall = () => {
  const { LightMode }  = useSelector((state) => state.auth);

  const smallLoader = LightMode ? "dot-spinner" : "dot-spinnerDark"

  return (
    <>
      <div className={`${smallLoader} transition-colors duration-300 ease-in-out animate-UpDown`}>
        <div className="dot-spinner__dot"></div>
        <div className="dot-spinner__dot"></div>
        <div className="dot-spinner__dot"></div>
        <div className="dot-spinner__dot"></div>
        <div className="dot-spinner__dot"></div>
        <div className="dot-spinner__dot"></div>
        <div className="dot-spinner__dot"></div>
        <div className="dot-spinner__dot"></div>
      </div>
    </>
  )
}




const PROPERTY = [
  "Apartment / Flat",
  "House / Home",
  "Office / Industry",
  "Hotel / Guest House",
  "Restaurant / Cafe",
  "Warehouse",
  "Hospital / Clinic",
  "Event Hall",
  "Others..."
];

const SERVICES = [
  "Basic Cleaning",
  "Deep Cleaning",
  "Move-In / Move-Out Cleaning",
  "Environmental Cleaning",
  "Window Cleaning",
  "Carpet Cleaning",
  "Sofa / Upholstery Cleaning",
  "Janitorial Cleaning",
  "Others..."
];

export default function EditBookingForm({
  booking,
  updateBooking,
  loading,
  open,
  setOpen
}) {
  const { LightMode } = useSelector((state) => state.auth);
  
  const [shake, setShake] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      clientName: "",
      phoneNumber: "",
      property: PROPERTY[0],
      service: SERVICES[0],
      address: "",
    }
  });



  // Error handler
  const triggerShake = () => {
    setShake(true);

    if (navigator.vibrate) {
      navigator.vibrate(300);
    }

    setTimeout(() => {
      setShake(false);
    }, 1000);
  };

  const handleFormError = (formErrors) => {    
    if (formErrors.clientName && formErrors.phoneNumber && formErrors.property && formErrors.service && formErrors.address) {
      toast.error("Please fill in all required fields");
      triggerShake()
    } else if (formErrors.clientName) {
      toast.error("Client name field is required");
      triggerShake()
    } else if (formErrors.phoneNumber) {
      toast.error("Phone number field is required");
      triggerShake()
    } else if (formErrors.property) {
      toast.error("Property field is required");
      triggerShake()
    }
  };



  useEffect(() => {
    if (booking) {
      reset({
        clientName: booking.clientName,
        phoneNumber: booking.phoneNumber,
        property: booking.property,
        service: booking.service,
        address: booking.address,
      });
    }
  }, [booking, reset]);

  const onSubmit = async (data) => {
    try {
      await updateBooking({
        bookingId: booking._id,
        ...data,
      }).unwrap();

      setOpen(false);

      toast.success("Booking updated successfully");
    } catch (error) {
      toast.error(
        error?.data?.message ||
        "Failed to update booking"
      );
    }
  };

  const bgCon = LightMode
    ? "bg-white shadow-darkSM"
    : "bg-black/90 shadow-lightSM";

  const text = LightMode
    ? "text-black"
    : "text-white";

  const shadow = LightMode
    ? "shadow-darkSM"
    : "shadow-lightSM";

  return (
    <ModalWrapper open={open} setOpen={setOpen}>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl mx-auto relative"
        >
          <div>
            <h2 className={`${text} text-xl font-semibold mb-6`}>
              Edit Booking
            </h2>

            <form
              onSubmit={handleSubmit(onSubmit, handleFormError)}
              className="space-y-4"
            >
              {/* CLIENT NAME */}

              <Textbox
                label="Client Name"
                placeholder="Enter full name"
                name="clientName"
                className={`w-full rounded-xl py-2 border outline-0 transition-all duration-200 ${
                  errors.clientName
                    ? `border-2 border-red-500 focus:border-red-500 ${
                        shake ? "animate-shake" : ""
                      }`
                    : "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                }`}
                rules={{ required: "Client name is required!" }}
                register={register("clientName", {
                  required: "Client name is required!",
                })}
                error={errors.clientName ? errors.clientName?.message : ""}
              />

              {/* PHONE */}

              <Textbox
                label="Phone Number"
                placeholder="Enter phone number"
                name="phoneNumber"
                className={`w-full rounded-xl py-2 border outline-0 transition-all duration-200 ${
                  errors.phoneNumber
                    ? `border-2 border-red-500 focus:border-red-500 ${
                        shake ? "animate-shake" : ""
                      }`
                    : "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                }`}
                rules={{ required: "Phone number is required!" }}
                register={register("phoneNumber", {
                  required: "Phone number is required!",
                })}
                error={errors.phoneNumber ? errors.phoneNumber?.message : ""}
              />

              {/* PROPERTY */}

              <Controller
                control={control}
                name="property"
                rules={{
                  required: "Property type is required",
                }}
                render={({ field }) => (
                  <div>
                    <label
                      className={`${text} block mb-1 text-sm`}
                    >
                      Property Type
                    </label>

                    <Listbox
                      value={field.value}
                      onChange={field.onChange}
                    >
                      {({ open }) => (
                        <div className="relative">
                          <Listbox.Button
                            className={`
                              ${text} w-full px-3 py-2
                              rounded-xl border
                              flex justify-between items-center
                            `}
                          >
                            <span>{field.value}</span>

                            {open ? (
                              <ChevronsUp size={18} />
                            ) : (
                              <ChevronDown size={18} />
                            )}
                          </Listbox.Button>

                          <Transition
                            as={Fragment}
                            leave="transition duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                          >
                            <Listbox.Options
                              className={`${bgCon} ${text} absolute z-50 mt-2 w-full rounded-l-xl border overflow-y-auto overflow-x-hidden max-h-46`}
                            >
                              {PROPERTY.map((item) => (
                                <Listbox.Option
                                  key={item}
                                  value={item}
                                  className={({ active }) =>
                                    `cursor-pointer px-4 py-2 text-sm transition-all duration-300 ease-in-out hover:scale-102 ${
                                      active ? `${LightMode ? "bg-blue-500 text-white hover:shadow-dark" : "bg-blue-900 text-blue-100 hover:shadow-light"}` : `${LightMode ? "text-gray-900" : "text-gray-200"}`
                                    }`
                                  }
                                >
                                  {item}
                                </Listbox.Option>
                              ))}
                            </Listbox.Options>
                          </Transition>
                        </div>
                      )}
                    </Listbox>

                    {errors.property && (
                      <p className="text-red-500 text-xs mt-1 italic">
                        {errors.property.message}
                      </p>
                    )}
                  </div>
                )}
              />

              {/* SERVICE */}

              <Controller
                control={control}
                name="service"
                rules={{
                  required: "Service type is required",
                }}
                render={({ field }) => (
                  <div>
                    <label
                      className={`${text} block mb-1 text-sm`}
                    >
                      Service Type
                    </label>

                    <Listbox
                      value={field.value}
                      onChange={field.onChange}
                    >
                      {({ open }) => (
                        <div className="relative">
                          <Listbox.Button
                            className={`
                              ${text} w-full px-3 py-2
                              rounded-xl border
                              flex justify-between items-center
                              
                            `}
                          >
                            <span>{field.value}</span>

                            {open ? (
                              <ChevronsUp size={18} />
                            ) : (
                              <ChevronDown size={18} />
                            )}
                          </Listbox.Button>

                          <Transition
                            as={Fragment}
                            leave="transition duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                          >
                            <Listbox.Options
                              className={`${bgCon} ${text} absolute z-50 mt-2 w-full rounded-l-xl border overflow-y-auto overflow-x-hidden max-h-46`}
                            >
                              {SERVICES.map((item) => (
                                <Listbox.Option
                                  key={item}
                                  value={item}
                                  className={({ active }) =>
                                    `cursor-pointer px-4 py-2 text-sm transition-all duration-300 ease-in-out hover:scale-102 ${
                                      active ? `${LightMode ? "bg-blue-500 text-white hover:shadow-dark" : "bg-blue-900 text-blue-100 hover:shadow-light"}` : `${LightMode ? "text-gray-900" : "text-gray-200"}`
                                    }`
                                  }
                                >
                                  {item}
                                </Listbox.Option>
                              ))}
                            </Listbox.Options>
                          </Transition>
                        </div>
                      )}
                    </Listbox>

                    {errors.service && (
                      <p className="text-red-500 text-xs mt-1 italic">
                        {errors.service.message}
                      </p>
                    )}
                  </div>
                )}
              />

              {/* ADDRESS */}

              <Textbox
                label="Service Address"
                placeholder="Enter service address"
                name="address"
                className={`w-full rounded-xl py-2 border outline-0 transition-all duration-200 ${
                  errors.address
                    ? `border-2 border-red-500 focus:border-red-500 ${
                        shake ? "animate-shake" : ""
                      }`
                    : "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                }`}
                rules={{ required: "Address is required!" }}
                register={register("address", {
                  required: "Address is required!",
                })}
                error={errors.address ? errors.address?.message : ""}
              />

              {loading ? (
                <div className='flex justify-center items-center py-3'>
                  <LoadingSmall />
                </div>
              ) : (
              <button
                type="submit"
                disabled={loading}
                className="
                  w-full
                  py-3
                  rounded-xl
                  shadow-inner
                  hover:shadow-innerWH
                  cursor-pointer
                  active:scale-95
                  bg-blue-600
                  text-white
                  font-semibold
                  hover:bg-blue-700
                  transition-all
                "
              >
                Save Changes
              </button>
              )}
            </form>
          </div>

          <div className={`${shadow} rounded-full px-0 py-1.5 absolute z-10 -top-8 -right-7`}>
            <span
              onClick={() => setOpen(false)}
              className={`
                  font-bold bg-white shadow-inner text-red-600 rounded-full px-3 py-2 cursor-pointer text-md hover:scale-110 hover:shadow-innerGRN active:scale-95 transition-all duration-300 ease-in-out
                `}
            >
              ✕
            </span>
          </div>
        </motion.div>
      </AnimatePresence>
    </ModalWrapper>
  );
}