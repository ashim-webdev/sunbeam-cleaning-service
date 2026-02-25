import { Listbox, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { BsChevronExpand } from "react-icons/bs";
import { MdCheck } from "react-icons/md";
import { useSelector } from "react-redux";

const SelectList = ({ lists, selected, setSelected, label }) => {
  const { LightMode } = useSelector((state) => state.auth);

  return (
    <div className='w-full'>
      {label && <p className={`
            ${LightMode 
              ? "text-black" 
              : "text-white"
            }
            transition-colors duration-300 ease-in-out
          `}>{label}</p>}
      <Listbox value={selected} onChange={setSelected}>
        <div className='relative mt-1'>
          <Listbox.Button className={`
              ${LightMode 
                ? "bg-white text-black border-gray-300" 
                : "bg-black text-white border-gray-600"
              }
              relative w-full cursor-pointer rounded  pl-3 pr-10 text-left px-3 py-2.5 2xl:py-3 border sm:text-sm transition-colors duration-300 ease-in-out
            `}>
            <span className='block truncate'>{selected}</span>
            <span className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2'>
              <BsChevronExpand
                className={`h-5 w-5 ${LightMode ? "text-gray-700" : "text-gray-300"}`}
                aria-hidden='true'
              />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave='transition ease-in duration-100'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <Listbox.Options className={`
                ${LightMode 
                  ? "bg-white ring-black/10" 
                  : "bg-black ring-white/10"
                }
                z-50 absolute mt-1 max-h-60 w-full overflow-auto rounded-md py-1 shadow-lg ring-1 focus:outline-none sm:text-sm transition-colors duration-300 ease-in-out
              `}>
              {lists.map((list, index) => (
                <Listbox.Option
                  key={index}
                  className={({ active }) =>
                    `relative cursor-pointer select-none py-2 pl-10 pr-4 mx-1.5 transition-colors duration-300 ease-in-out hover:scale-105 ${
                      active ? `${LightMode ? "bg-amber-100 text-amber-900 hover:shadow-dark" : "bg-amber-900 text-amber-100 hover:shadow-light"}` : `${LightMode ? "text-gray-900" : "text-gray-200"}`
                    }`
                  }
                  value={list}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? "font-medium" : "font-normal"
                        }`}
                      >
                        {list}
                      </span>
                      {selected ? (
                        <span className='absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600'>
                          <MdCheck className='h-5 w-5' aria-hidden='true' />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
};
export default SelectList;
