import clsx from "clsx";
import { Card, CardContent, CardFooter, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { useDispatch, useSelector } from "react-redux";
import { setSelectUserDashInfo } from "../../redux/slices/authSlice";
import { getInitials } from "../../utils/index";
import { summary } from "../../assets/data";




const CardList = ({ title }) => {
  const info = summary

  const dispatch = useDispatch()

  const useInfo = (user) => {
    dispatch(setSelectUserDashInfo(user))
    // console.log(user)
  }

  return (
    <div className="">
      <h1 className="text-lg font-medium mb-6">{title}</h1>
      <div className={`${info.users.length > 5 ? "overflow-y-auto h-109" :  "h-full"} bg-gray-100 w-full  pb-1.5 pt-2 px-2 flex flex-col gap-2 `}>
        {info.users.map((user) => (
          <Card 
            key={user._id} 
            onClick={(e) => {
              e.stopPropagation()
              useInfo(user)
            }}
            className="flex-row users-center justify-between gap-4 p-4 cursor-pointer hover:shadow-darkSM hover:bg-gray-50 transition-all duration-300 ease-in-out active:scale-95"
          >
            <div 
              className={clsx(
                "w-11 h-11 rounded-full border-2 flex items-center justify-center text-white text-sm shadow-inner overflow-hidden bg-blue-600",
                user.isActive ? "border-green-500" : "border-red-600"
            )}>
              {user?.img ? 
                <img src={user?.img} alt="Avatar" className="w-full h-full object-cover "/>
              :
                <span className='text-xs md:text-sm text-center'>
                  {getInitials(user?.name)}
                </span>
              }
            </div>
            <CardContent className="flex-1 p-0">
              <CardTitle className="text-sm font-medium">{user.name}</CardTitle>
              <Badge variant="secondary">{user.title}</Badge>
            </CardContent>
            <CardFooter className="pr-4 text-xl text-blue-600">
              <i className="fa-solid fa-chart-simple drop-shadow-[-2px_0.5px_1px_w]"></i>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CardList;
