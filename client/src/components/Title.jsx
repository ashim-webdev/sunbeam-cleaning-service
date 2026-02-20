import clsx from "clsx";
import { useSelector } from "react-redux";


const Title = ({ title, className }) => {
  const { LightMode } = useSelector((state) => state.auth);
  
  return (
    <h2
      className={clsx(
        "text-2xl font-semibold capitalize",
        LightMode
        ? "text-gray-700 "
        : "text-gray-300",
        className
      )}
    >
      {title}
    </h2>
  );
};

export default Title;
