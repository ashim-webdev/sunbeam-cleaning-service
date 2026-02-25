import React from "react";
import clsx from "clsx";
import { useDispatch, useSelector } from "react-redux";


const Textbox = React.forwardRef(
  (
    { type, placeholder, label, className, springClass, labelClass, register, name, error },
    ref
  ) => {
    const { LightMode } = useSelector((state) => state.auth);
    

    return (
      <div className='relative w-full flex flex-col gap-1'>
        {label && (
          <span
            htmlFor={name}
            className={clsx(
              LightMode 
                ? "text-black"
                : "text-white"
              ,
              "transition-colors duration-300 ease-in-out", labelClass
            )}
          >
            {label}
          </span>
        )}

        <div className={`${springClass} ${LightMode ? "" : "dark"}`}>
          <input
            type={type}
            name={name}
            placeholder={placeholder}
            ref={ref}
            className={clsx(
              LightMode 
                ? "text-black placeholder-gray-300 border-gray-300"
                : "text-white placeholder-gray-400 border-gray-400",
              "py-1.25 px-3.75 border outline-none text-base focus:ring-2 ring-blue-300 transition-colors duration-300 ease-in-out",
              className
            )}
            {...register}
            aria-invalid={error ? "true" : "false"}
          />
        </div>
        {error && (
          <span className='text-xs text-[#f64949fe] mt-0.5 italic'>{error}</span>
        )}
      </div>
    );
  }
);

export default Textbox;
