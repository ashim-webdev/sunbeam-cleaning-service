import React from "react";
import { useRef, useState } from "react";
import clsx from "clsx";
import { useSelector } from "react-redux";
import DatePicker from "react-datepicker";
import { Controller } from "react-hook-form";
import "react-datepicker/dist/react-datepicker.css";
import "./datepicker-custom.css";

const Textbox = React.forwardRef(
  (
    {
      type,
      placeholder,
      label,
      className,
      springClass,
      labelClass,
      name,
      control,
      register,
      error,
      rules,
      onFocus,
    },
    ref
  ) => {
    const { LightMode } = useSelector((state) => state.auth);
    
    const [open, setOpen] = useState(false);
    // const datePickerRef = useRef(null);
    const today = new Date();
    const safeToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    return (
      <div className="relative w-full flex flex-col gap-1">
        {label && ( 
          <span
            className={clsx(
              LightMode ? "text-black" : "text-white",
              "transition-colors duration-300 ease-in-out",
              labelClass
            )}
          >
            {label}
          </span>
        )}

        {/* DATEPICKER SECTION */}
        {type === "date" ? (
          <div className="relative">
            <Controller
              name={name}
              control={control}
              rules={rules}
              render={({ field }) => (
                <DatePicker
                  // ref={datePickerRef}
                  {...field}
                  selected={field.value}
                  onChange={(date) => {
                    field.onChange(date);
                    setOpen(false);
                  }}
                  open={open}
                  onClickOutside={() => setOpen(false)}
                  placeholderText={placeholder}
                  minDate={safeToday}
                  className={clsx(
                    LightMode
                      ? " bg-white text-black border-gray-300"
                      : " bg-black/90 text-white border-gray-500",
                    "w-full rounded py-2 px-3 border outline-none focus:ring-2 ring-blue-300 transition-colors duration-300 ease-in-out",
                    className
                  )}
                  calendarClassName={clsx(
                    LightMode
                      ? "light-calendar"
                      : "dark-calendar"
                  )}
                  popperClassName="w-full"
                  wrapperClassName="w-full"
                  dateFormat="dd/MM/yyyy"
                  popperPlacement="bottom-center"
                />
              )}
            />
            <i
              onClick={() => setOpen((prev) => !prev)}
              className={`
                ${LightMode ? "text-black/70 hover:text-black" : "text-white/70 hover:text-white"}
                fa-solid fa-calendar sm:text-xl text-lg absolute top-2.75 [@media(min-width:500px)_and_(max-width:767px)]:right-4 right-2 cursor-pointer shadow-2xl transition-all duration-300 ease-in-out active:scale-90
              `}></i>
          </div>
        ) : (
          <div className={`${springClass} ${LightMode ? "" : "dark"}`}>
            <input
              type={type}
              name={name}
              placeholder={placeholder}
              ref={ref}
              onFocus={onFocus}
              className={clsx(
                LightMode 
                  ? "text-black placeholder-gray-300 border-gray-300"
                  : "text-white placeholder-gray-400 border-gray-400",
                "py-1.25 px-3.75 font-normal border outline-none text-base focus:ring-2 ring-blue-300 transition-colors duration-300 ease-in-out",
                className
              )}
              {...register}
              aria-invalid={error ? "true" : "false"}
            />
          </div>
        )}

        {error && (
          <span className="text-xs text-[#f64949fe] mt-0.5 italic">
            {error}
          </span>
        )}
      </div>
    );
  }
);

export default Textbox;