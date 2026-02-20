import { Tab } from "@headlessui/react";
import { useDispatch, useSelector } from "react-redux";



// Using Headlessui to combine "classNames" instead of clsx
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Tabs = ({ tabs, setSelected, children }) => {
  const { LightMode } = useSelector((state) => state.auth);

  return (
    <div className='w-full px-1 sm:px-0'>
      <Tab.Group>
        <Tab.List className='flex space-x-6 rounded-xl p-1'>
          {tabs.map((tab, index) => (
            <div className="ClickAnimationNoti">
              <Tab
                key={tab.title}
                onClick={() => setSelected(index)}
                className={({ selected }) =>
                  classNames(
                    LightMode 
                    ? "bg-white shadow-inner"
                    : "bg-black/90 shadow-innerWH text-white hover:shadow-innerBLU",
                    "w-fit flex items-center outline-none gap-2 px-3 py-2.5 text-base font-medium leading-5 cursor-pointer  transition-colors duration-200 ease-in-out",
                    selected
                      ? "text-blue-700 dark:text-white border-b-2 border-blue-600"
                      : "text-gray-800 dark:text-gray-500 hover:text-blue-500"
                  )
                }
              >
                {tab.icon}
                <span>{tab.title}</span>
              </Tab>
            </div>
          
          ))}
        </Tab.List>
        <Tab.Panels className='w-full mt-2'>{children}</Tab.Panels>
      </Tab.Group>
    </div>
  );
}

export default Tabs;