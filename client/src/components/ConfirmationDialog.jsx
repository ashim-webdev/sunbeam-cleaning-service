import { useState } from "react";
import { Dialog } from "@headlessui/react";
import clsx from "clsx";
import { FaQuestion, FaCopy } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from 'framer-motion';
import Button from "./Button";
import ModalWrapper from "./ModalWrapper";



const Loading = () => {
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



export default function ConfirmationDialog({
  open,
  setOpen,
  msg,
  onClick = () => {},
  type = "delete",
  isLoading,
  setMsg = () => {},
  setType = () => {},
}) {
  const { LightMode } = useSelector((state) => state.auth);
  
  const closeDialog = () => {
    if (isLoading) return;

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
            className='py-4  w-full flex flex-col gap-4 items-center justify-center'
          >
            <Dialog.Title as='h3' className=''>
              <p
                className={clsx(
                  "rounded-full",
                  type === "Change Stage" ? "p-4" : "p-4",
                  type === "restore" || type === "restoreAll"
                    ? "text-yellow-600 bg-yellow-100"
                    :
                  type === "duplicate"
                    ? "text-blue-600 bg-blue-100"
                    :
                  type === "Change Stage"
                    ? "text-green-600 bg-green-100"
                    : "text-red-600 bg-red-100"
                )}
              >
                {
                  type === "duplicate" ?
                    <FaCopy size={60} />
                    :
                  type === "Change Stage" ?
                    <i className="fa-solid fa-check-double text-green-600 text-6xl rounded-full px-3 py-2"></i>
                    :
                    <FaQuestion size={60} />
                }
              </p>
            </Dialog.Title>

            <p className={`text-center ${LightMode ? "text-gray-700" : "text-gray-200"} transition-all duration-300 ease-in-out`}>
              {msg ?? "Are you sure you want to delete the selected record?"}
            </p>

            <div className=' py-3 flex sm:flex-row-reverse gap-4'>
              {isLoading ? (
                <div className="px-8 flex justify-center items-center">
                  <Loading />
                </div>
              ) : (
                <Button
                  type='button'
                  disabled={isLoading}
                  className={clsx(
                    "shadow-inner hover:shadow-innerWH hover:scale-105 px-8 text-sm font-semibold text-white sm:w-auto transition-all duration-150 ease-in-out",
                    isLoading ? "cursor-not-allowed opacity-50" : "cursor-pointer",
                    type === "restore" || type === "restoreAll"
                      ? "bg-yellow-600 hover:bg-blue-500" 
                      :
                    type === "duplicate"
                      ? "bg-blue-600 hover:bg-blue-500"
                      :
                    type === "Change Stage"
                      ? "bg-green-600 hover:bg-green-500"
                      : "bg-red-600 hover:bg-red-500"
                  )}
                  onClick={onClick}
                  label={
                    type === "restore"
                    ? "Restore" 
                    :
                    type === "duplicate"
                    ? "Duplicate"
                    :
                    type === "Submit"
                    ? "Submit"
                    :
                    type === "Change Stage"
                    ? "Change Stage"
                    :
                    "Delete "
                  }
                />
              )}

              {type === "Change Stage" ? null : (
                <Button
                  type='button'
                  disabled={isLoading}
                  className={`${isLoading ? "cursor-not-allowed opacity-50" : "cursor-pointer"} bg-white shadow-inner hover:shadow-innerWH hover:scale-105 px-8 text-sm font-semibold text-gray-900 sm:w-auto border transition-all duration-150 ease-in-out`}
                  onClick={() => closeDialog()}
                  label='Cancel'
                />
              )}

            </div>
          </motion.div>
        </AnimatePresence>
      </ModalWrapper>
    </>
  );
}

export function UserAction({ open, setOpen, isLoading, onClick = () => {} }) {
  const { LightMode } = useSelector((state) => state.auth);

  const closeDialog = () => {
    if (isLoading) return;

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
              {isLoading ? (
                <div className="px-8 flex justify-center items-center">
                  <Loading />
                </div>
              ) : (
                <Button
                  type='button'
                  disabled={isLoading}
                  className={clsx(
                    "shadow-inner hover:shadow-innerWH hover:scale-105 px-8 text-sm font-semibold text-white sm:w-auto transition-all duration-150 ease-in-out",
                    "bg-red-600 hover:bg-red-500",
                    isLoading ? "cursor-not-allowed opacity-50" : "cursor-pointer"
                  )}
                  onClick={onClick}
                  label={"Yes"}
                />
              )}

              <Button
                type='button'
                disabled={isLoading}
                className={`${isLoading ? "cursor-not-allowed opacity-50" : "cursor-pointer"} bg-white shadow-inner hover:shadow-innerWH hover:scale-105 px-8 text-sm font-semibold text-gray-900 sm:w-auto border transition-all duration-150 ease-in-out`}
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
