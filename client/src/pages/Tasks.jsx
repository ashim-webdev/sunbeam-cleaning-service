import React, { useEffect, useState } from "react";
import { FaList } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import { MdGridView } from "react-icons/md";
import { useParams } from "react-router-dom";
import Button from "../components/Button"
import Loading from "../components/Loading"
import Tabs from "../components/Tabs"
import Title from "../components/Title"
import Table from "../components/Table";
import TaskTitle from "../components/TaskComponents/TaskTitle"
import BoardView from "../components/TaskComponents/BoardView";
import AddTask from "../components/TaskComponents/AddTask";
import { tasks } from "../assets/data";

import { TASK_TYPE } from "../utils";
import { useSelector } from "react-redux";

const TABS = [
  { title: "Board View", icon: <MdGridView /> },
  { title: "List View", icon: <FaList /> },
];

const Tasks = () => {
  const params = useParams();
  // const { user } = useSelector((state) => state.auth);

  const [selected, setSelected] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  // const [status, setStatus] = useState(false);

  const status = params?.status || "";



  return isLoading ? (
    <div className='py-10'>
      <Loading />
    </div>
  ) : (
    <div className='w-full'>
      <div className='flex items-center justify-between mb-4'>
        <Title title={status ? `${status}` : "Tasks"} />

        {!status && (
          <Button
            label='Create Task'
            icon={<IoMdAdd className='text-lg' />}
            className='ClickAnimation flex flex-row-reverse gap-1 items-center bg-blue-600 text-white rounded-md py-2 2xl:py-2.5 shadow-inner hover:shadow-innerWH transition-all duration-300 ease-in-out'
            onClick={() => setOpen(true)}
          />
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

          {selected === 0 ? (
            <BoardView tasks={tasks} />
          ) : (
            <Table tasks={tasks} />
          )}
        </Tabs>
      </div>
      <AddTask open={open} setOpen={setOpen} />
    </div>
  );
};

export default Tasks;
