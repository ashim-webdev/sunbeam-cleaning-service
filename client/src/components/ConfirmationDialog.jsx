import { Dialog } from "@headlessui/react";
import clsx from "clsx";
import { FaQuestion } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from 'framer-motion';
import Button from "./Button";
import ModalWrapper from "./ModalWrapper";

export default function ConfirmationDialog({
  open,
  setOpen,
  msg,
  onClick = () => {},
  type = "delete",
  setMsg = () => {},
  setType = () => {},
}) {
  const { LightMode } = useSelector((state) => state.auth);
  
  const closeDialog = () => {
    setOpen(false);

    // AI said i should delete this 
    // setType(type);
    // setMsg(msg);
  };

  return (
    <>
      <ModalWrapper open={open} setOpen={closeDialog}>
        <AnimatePresence>
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.8 }}
            className='py-4 w-full flex flex-col gap-4 items-center justify-center'
          >
            <Dialog.Title as='h3' className=''>
              <p
                className={clsx(
                  "p-3 rounded-full ",
                  type === "restore" || type === "restoreAll"
                    ? "text-yellow-600 bg-yellow-100"
                    : "text-red-600 bg-red-150"
                )}
              >
                <FaQuestion size={60} />
              </p>
            </Dialog.Title>

            <p className={`text-center ${LightMode ? "text-gray-700" : "text-gray-200"} transition-all duration-300 ease-in-out `}>
              {msg ?? "Are you sure you want to delete the selected record?"}
            </p>

            <div className=' py-3 flex sm:flex-row-reverse gap-4'>
              <Button
                type='button'
                className={clsx(
                  "shadow-inner hover:shadow-innerWH hover:scale-105 px-8 text-sm font-semibold text-white sm:w-auto transition-all duration-150 ease-in-out",
                  type === "restore" || type === "restoreAll"
                    ? "bg-yellow-600"
                    : "bg-red-600 hover:bg-red-500"
                )}
                onClick={onClick}
                label={type === "restore" ? "Restore" : "Delete"}
              />

              <Button
                type='button'
                className='bg-white shadow-inner hover:shadow-innerWH hover:scale-105 px-8 text-sm font-semibold text-gray-900 sm:w-auto border transition-all duration-150 ease-in-out'
                onClick={() => closeDialog()}
                label='Cancel'
              />
            </div>
          </motion.div>
        </AnimatePresence>
      </ModalWrapper>
    </>
  );
}

export function UserAction({ open, setOpen, onClick = () => {} }) {
  const { LightMode } = useSelector((state) => state.auth);

  const closeDialog = () => {
    setOpen(false);
  };

  return (
    <>
      <ModalWrapper open={open} setOpen={closeDialog}>
        <AnimatePresence>
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.8 }}
            className='py-4 w-full flex flex-col gap-4 items-center justify-center'
          >
            <Dialog.Title as='h3' className=''>
              <p className={clsx("p-3 rounded-full ", "text-red-600 bg-red-150")}>
                <FaQuestion size={60} />
              </p>
            </Dialog.Title>

            <p className={`${LightMode ? "text-gray-700" : "text-gray-200"} text-center`}>
              {"Are you sure you want to activate or deactivate this account?"}
            </p>

            <div className='bg-transparent py-3 flex sm:flex-row-reverse gap-4'>
              <Button
                type='button'
                className={clsx(
                  "shadow-inner hover:shadow-innerWH hover:scale-105 px-8 text-sm font-semibold text-white sm:w-auto transition-all duration-150 ease-in-out",
                  "bg-red-600 hover:bg-red-500"
                )}
                onClick={onClick}
                label={"Yes"}
              />

              <Button
                type='button'
                className='bg-white shadow-inner hover:shadow-innerWH hover:scale-105 px-8 text-sm font-semibold text-gray-900 sm:w-auto border transition-all duration-150 ease-in-out'
                onClick={() => closeDialog()}
                label='No'
              />
            </div>
          </motion.div>
        </AnimatePresence>
      </ModalWrapper>
    </>
  );
}
