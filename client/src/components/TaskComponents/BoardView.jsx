import { motion, AnimatePresence } from "framer-motion";
import TaskCard from "./TaskCard";

const BoardView = ({ tasks }) => {
  return (
    <motion.div
      layout
      className='w-full py-4 grid grid-cols-1 md:grid-cols-2 [@media(min-width:1324px)]:grid-cols-3 gap-4 2xl:gap-10'
    >
      <AnimatePresence mode="wait">
        {tasks?.map((task, index) => (
          <motion.div
            key={task._id}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{
              duration: 0.4,
              delay: index * 0.08, // 👈 stagger effect
              ease: "easeOut",
            }}
          >
            <TaskCard task={task} />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
};

export default BoardView;
