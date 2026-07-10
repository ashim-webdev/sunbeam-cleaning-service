import { socket } from "../socket";
import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaList } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import { MdGridView } from "react-icons/md";
import { useParams, useSearchParams } from "react-router-dom";
import Button from "../components/Button"
import Loading from "../components/Loading"
import Tabs from "../components/Tabs"
import Title from "../components/Title"
import Table from "../components/Table";
import TaskTitle from "../components/TaskComponents/TaskTitle"
import BoardView from "../components/TaskComponents/BoardView";
import AddTask from "../components/TaskComponents/AddTask";
import Pagination from "../components/Pagination";
import { useGetAllTaskQuery } from "../redux/slices/api/taskApiSlice";

import { TASK_TYPE } from "../utils";
import { useSelector } from "react-redux";






const TABS = [
  { title: "Board View", icon: <MdGridView /> },
  { title: "List View", icon: <FaList /> },
];

const Tasks = () => {
  const params = useParams();
  const [searchParams] = useSearchParams();
  const { LightMode, user } = useSelector((state) => state.auth);

  const [selected, setSelected] = useState(0);
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);

  const status = params?.status || "";

  const search = searchParams.get("search") || "";

  const {
    data,
    isLoading,
    refetch,
  } = useGetAllTaskQuery({
    strQuery: status,
    isTrashed: "",
    search,
    page,
    limit: 12,
  });

  // Reset to page 1 when search or status changes
  useEffect(() => {
    setPage(1);
  }, [search, status]);

  // Socket.io real time task update
  useEffect(() => {
    socket.on("taskCreated", () => {
      refetch();
    });

    socket.on("taskUpdated", () => {
      refetch();
    });

    socket.on("taskDeleted", () => {
      refetch();
    });

    return () => {
      socket.off("taskCreated");
      socket.off("taskUpdated");
      socket.off("taskDeleted");
    };
  }, [refetch]);

  const tasks = data?.tasks || [];


  return isLoading ? (
    <Loading />
  ) : (
    <div className='w-full overflow-hidden'>
      <div className='flex items-center justify-between mb-8'>
        <Title title={status ? `${status}` : "Tasks"} />

        {!status && (
          <>
            {user.isAdmin && (
              <Button
                label='Create Task'
                icon={<IoMdAdd className='text-lg' />}
                className='ClickAnimation flex flex-row-reverse gap-1 items-center gradient-bg text-white rounded-md py-2 2xl:py-2.5 shadow-darkSM hover:shadow-inner transition-all duration-300 ease-in-out'
                onClick={() => setOpen(true)}
              />
            )}
          </>
        )}
      </div>

      <div>
        <Tabs tabs={TABS} setSelected={setSelected}>
          {!status && (
            <div className='w-full flex justify-between gap-4 md:gap-x-12 py-4'>
              <TaskTitle label='To Do' className={TASK_TYPE.todo} />
              <TaskTitle
                label='In Progress'
                className={TASK_TYPE["in progress"]}
              />
              <TaskTitle label='Completed' className={TASK_TYPE.completed} />
            </div>
          )}

          {tasks.length === 0 ? 
            (
              <span className={`${LightMode ? "text-black/60" : "text-white/60"} w-full block text-center mt-20 p-2 text-lg animate-bounce`}>
                {
                  search
                  ? `No tasks found for "${search}" :(`
                  : user.isAdmin
                    ? "Create a task :)"
                    : "No assigned task yet :("
                }
              </span>
            )
              :
            (
              <>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${page}-${search}-${status}`} // Refetch data when page, search, or status changes
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    transition={{ duration: 0.8 }}
                    className="mb-12"
                  >
                    {selected === 0 ? (
                      <BoardView tasks={tasks} />
                    ) : (
                      <Table tasks={tasks} tableSize={data.totalPages > 1} />
                    )}
                  </motion.div>
                </AnimatePresence>

                {data.totalPages > 1 && (
                  <Pagination
                    page={page}
                    setPage={setPage}
                    totalPages={data?.totalPages || 1}
                  />
                )}
              </>
            )
          }
        </Tabs>
      </div>
      <AddTask open={open} setOpen={setOpen} />
    </div>
  );
};

export default Tasks;
