import clsx from "clsx";
import React from "react";

const TaskColor = ({ className }) => {
  return <div className={clsx("w-4 h-4 px-2 rounded-full whitespace-nowrap shadow-inner", className)} />;
};

export default TaskColor;
