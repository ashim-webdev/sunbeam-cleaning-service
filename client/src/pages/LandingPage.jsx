import { useSelector } from "react-redux";


import BookingForm from "../components/LandingPageComponents/BookingForm";



export default function LandingPage() {
  const { LightMode } = useSelector((state) => state.auth);



  const bg = LightMode ? "bg-white/60 shadow-darkSM" : "bg-black/60 shadow-lightSM";
  return (
    <div className={`${bg} min-h-screen text-stone-900 font-sans transition-all duration-300 ease-in-out`}>
      <BookingForm />
    </div>
  );
}


