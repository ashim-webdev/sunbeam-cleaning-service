import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";


const ModalWrapper = ({ open, setOpen, children }) => {
  const { LightMode } = useSelector((state) => state.auth);
  
  const cancelButtonRef = useRef(null);

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as='div'
        className='relative z-80 w-full'
        initialFocus={cancelButtonRef}
        onClose={() => {}}
      >
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className={`
              ${LightMode 
                ? "bg-black/80"
                : "bg-white/80"
              }
              fixed inset-0 transition-all duration-300 ease-in-out  bg-opacity-60 
            `} />
        </Transition.Child>

        <div className='fixed inset-0 z-10 w-screen overflow-y-auto'>
          <div className='flex min-h-full items-center justify-center p-4 text-center sm:p-0'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
              enterTo='opacity-100 translate-y-0 sm:scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 translate-y-0 sm:scale-100'
              leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
            >
              <Dialog.Panel className={`
                  ${LightMode 
                    ? "bg-white"
                    : "bg-black/80"
                  }
                  w-full relative transform rounded-lg  text-left shadow-xl transition-all duration-300 ease-in-out pb-0 sm:my-8 sm:w-full sm:max-w-lg
                `}>
                <div className={`
                    ${LightMode 
                      ? "bg-white shadow-inner"
                      : "bg-black/80 shadow-innerWH"
                    }
                    px-4 pb-4 pt-5 sm:p-6 sm:pb-4 rounded-lg transition-colors duration-300 ease-in-out
                  `}>
                  <div className='sm:flex sm:items-start'>
                    <div className='w-full mt-3  sm:ml-4 sm:mt-0 sm:text-left'>
                      {children}
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default ModalWrapper;
