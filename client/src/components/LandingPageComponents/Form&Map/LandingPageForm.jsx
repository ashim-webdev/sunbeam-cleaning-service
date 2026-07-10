// Client.jsx

import { motion } from "framer-motion";
import { APIProvider } from "@vis.gl/react-google-maps";
import { 
  MapPin, 
  Phone, 
  User, 
  ChevronDown,
  ChevronsUp,
} from 'lucide-react';
import { BiImages } from "react-icons/bi";
import { Fragment } from 'react';
import { toast } from 'sonner';
import { Listbox, Transition } from '@headlessui/react';
import MapContainer from "./MapContainer";


const PROPERTY = [
  'Apartment / Flat',
  'House / Home',
  'Office / Industry',
  'Hotel / Guest House',
  'Restaurant / Cafe',
  'Warehouse',
  'Hospital / Clinic',
  'Event Hall',
  'Others...',
];

const SERVICES = [
  'Basic Cleaning',
  'Deep Cleaning',
  'Move-In / Move-Out Cleaning',
  'Environmental Cleaning',
  'Window Cleaning',
  'Carpet Cleaning',
  'Sofa / Upholstery Cleaning',
  'Janitorial Cleaning',
  'Others...'
];


export default function LandingPageForm({
  formData,
  setFormData,
  errors,
  setErrors,
  shake,
  images,
  setImages,
  validateBooking,
  addBooking,
  handleSelect,
  DEFAULT_CENTER
}) {
  const bg = "bg-white/60 shadow-darkSM";
  const bgCon = "bg-white shadow-darkSM";
  const bgMenu = "bg-white shadow-dark border-black border-stone-200";
  const subText = "text-black/80";
  const UmCL ="bg-stone-100 text-black/90 hover:bg-stone-200";
  const imgBorder = "shadow-darkSM border-amber-400"
  return (
    <motion.div
      key="client"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="grid grid-cols-1 lg:grid-cols-12 gap-8"
    >
      {/* Booking Form */}
      <div className="lg:col-span-5 space-y-6">
        <div className={`${bgCon} p-6 pt-8 rounded-2xl border border-stone-200 transition-all duration-300 ease-in-out`}>
          
          <form 
            onSubmit={(e) => {
              e.preventDefault();

              if (!validateBooking()) return;

              addBooking({ ...formData, images });
              toast.success("Booking successful!");
            }}
            className="space-y-4"
          >
            <div>
              <label className={`block text-sm font-medium ${subText} mb-1 transition-all duration-300 ease-in-out`}>Name</label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.clientName}
                  onChange={e => {
                    setFormData(prev => ({ ...prev, clientName: e.target.value }));
                    setErrors(prev => ({ ...prev, clientName: null }));
                  }}
                  className={`placeholder-black/30 text-black w-full pl-10 pr-4 py-2 border rounded-xl outline-none transition-all ${
                    errors.clientName
                      ? `border-2 border-red-500 ${shake ? "animate-shake" : ""}`
                      : "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  }`}
                  placeholder="John Doe"
                />

                {typeof errors.clientName === "string" && (
                  <p className="text-red-500 text-xs mt-1 italic">{errors.clientName}</p>
                )}

                <User className="absolute left-3 top-5.5 -translate-y-1/2 text-stone-500" size={18} />
              </div>
            </div>

            <div>
              <label className={`${subText} block text-sm font-medium mb-1 transition-all duration-300 ease-in-out`}>Phone Number</label>
              <div className="relative">
                <input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={e => {
                    setFormData(prev => ({ ...prev, phoneNumber: e.target.value }));
                    setErrors(prev => ({ ...prev, phoneNumber: null }));
                  }}
                  className={`placeholder-black/30 text-black w-full pl-10 pr-4 py-2 border rounded-xl outline-none transition-all duration-300 ease-in-out ${
                    errors.phoneNumber
                      ? `border-2 border-red-500 ${shake ? "animate-shake" : ""}`
                      : "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  }`}
                  placeholder="+234 800 000 0000"
                />

                {typeof errors.phoneNumber === "string" && (
                  <p className="text-red-500 text-xs mt-1 italic">{errors.phoneNumber}</p>
                )}

                <Phone className="absolute left-3.5 top-5.5 -translate-y-1/2 text-stone-500" size={18} />
              </div>
            </div>

            <div className='flex flex-col justify-between items-center gap-4'>
              <div className='w-full'>
                <label className={`${subText} block text-sm font-medium mb-1 transition-all duration-300 ease-in-out`}>Property Type</label>
                  <Listbox
                    value={formData.property}
                    onChange={(value) =>
                      setFormData(prev => ({ ...prev, property: value }))
                    }
                  >
                    {({ open }) => (

                    <div className="relative">
                      
                      {/* Button */}
                      <Listbox.Button
                        className={`${subText} w-full px-2 py-2 border rounded-xl text-left border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none flex justify-between items-center cursor-pointer`}
                      >
                        <span className='line-clamp-1'>{formData.property}</span>
                        <span className="text-black text-sm bg-gray-200 rounded-full p-0.5">
                          {open ? <ChevronsUp size={22} className="font-bold animate-UpDown" /> : <ChevronDown size={22} className="font-bold" />}
                        </span>
                      </Listbox.Button>

                      {/* Options */}
                        <Transition
                          as={Fragment}
                          leave="transition ease-in duration-100"
                          leaveFrom="opacity-100"
                          leaveTo="opacity-0"
                        >
                          <Listbox.Options onClick={(e) => e.stopPropagation()} className={`${bgMenu} absolute mt-2 w-full border overflow-hidden rounded-xl z-50  outline-none transition-all duration-300 ease-in-out`}>
                            {PROPERTY.map((property, index) => (
                              <Listbox.Option
                                key={index}
                                value={property}
                                className={({ active }) =>
                                  `cursor-pointer px-4 py-2 text-sm transition-all duration-300 ease-in-out hover:scale-105 ${
                                    active ? `bg-blue-100 text-blue-900 hover:shadow-dark` : "text-gray-900"
                                  }`
                                }
                              >
                                {property}
                              </Listbox.Option>
                            ))}
                          </Listbox.Options>
                        </Transition>
                    </div>
                    )}
                  </Listbox>
              </div>

              <div className='w-full'>
                <label className={`${subText} block text-sm font-medium mb-1 transition-all duration-300 ease-in-out`}>Service Type</label>
                  <Listbox
                    value={formData.service}
                    onChange={(value) =>
                      setFormData(prev => ({ ...prev, service: value }))
                    }
                  >
                    {({ open }) => (

                    <div className="relative">
                      
                      {/* Button */}
                      <Listbox.Button
                        className={`${subText} w-full px-2 py-2 border rounded-xl text-left border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none flex justify-between items-center cursor-pointer`}
                      >
                        <span className='line-clamp-1'>{formData.service}</span>
                        <span className="text-black text-sm bg-gray-200 rounded-full p-0.5">
                          {open ? <ChevronsUp size={22} className="font-bold animate-UpDown" /> : <ChevronDown size={20} className="font-bold" />}
                        </span>
                      </Listbox.Button>

                      {/* Options */}
                        <Transition
                          as={Fragment}
                          leave="transition ease-in duration-100"
                          leaveFrom="opacity-100"
                          leaveTo="opacity-0"
                        >
                          <Listbox.Options onClick={(e) => e.stopPropagation()} className={`${bgMenu} absolute mt-2 w-full border rounded-xl shadow-lg z-50 overflow-hidden outline-none transition-all duration-300 ease-in-out`}>
                            {SERVICES.map((service, index) => (
                              <Listbox.Option
                                key={index}
                                value={service}
                                className={({ active }) =>
                                  `cursor-pointer px-4 py-2 text-sm transition-all duration-300 ease-in-out hover:scale-105 ${
                                    active ? `bg-blue-100 text-blue-900 hover:shadow-dark` : `"text-gray-900"`
                                  }`
                                }
                              >
                                {service}
                              </Listbox.Option>
                            ))}
                          </Listbox.Options>
                        </Transition>
                    </div>
                    )}
                  </Listbox>
              </div>
            </div>

            <div className="w-full h-0.5 bg-linear-to-l from-blue-400/10 via-blue-500 to-blue-400/10 mt-6" />


            <div className="w-full mt-4">
              <label className={`text-center sm:text-start block text-sm font-medium mb-2 ${subText}`}>
                Upload Photos of the Area to be Cleaned
              </label>

              <label
                htmlFor="imgUpload"
                className={`
                  flex flex-col items-center justify-center
                  border-2 border-dashed rounded-xl p-6 border-gray-300 hover:border-blue-400 bg-gray-50
                  cursor-pointer transition-all duration-300
                `}
              >
                <input
                  type="file"
                  id="imgUpload"
                  className="hidden"
                  onChange={handleSelect}
                  accept="image/*"
                  multiple
                />

                <BiImages size={28} className={`mb-2 opacity-70 ${subText}`} />

                <p className={`font-medium text-center ${subText}`}>
                  Tap to upload photos
                </p>

                <p className={`text-xs mt-1 text-center ${subText}`}>
                  Take clear pictures of the area (kitchen, floor, sofa, etc.)
                </p>
              </label>

              {/* Preview */}
              {images.length > 0 && (
                <div className="flex flex-wrap justify-center items-center mt-3 gap-2">
                  {images.map((img, index) => (
                    <div key={index} className="relative hover:scale-110 transition-all duration-300 ease-in-out">
                      <img
                        key={index}
                        src={img.preview}
                        loading="lazy"
                        decoding="async"
                        alt="preview"
                        className={`w-16 h-16 object-cover rounded-lg border ${imgBorder}`}
                      />

                      <span
                        onClick={() => {
                          setImages(prev => prev.filter((_, i) => i !== index));
                        }}
                        className="absolute top-1 right-1 font-bold bg-white shadow-inner text-red-600 rounded-full py-px cursor-pointer px-1 text-xs"
                      >
                        ✕
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className={`${subText} block text-sm font-medium text-stone-700 mb-1`}>Service Address</label>
              <div className="relative">
                <textarea
                  readOnly
                  value={formData.address}
                  className={`w-full pl-10 pr-4 py-2 border outline-none rounded-xl cursor-not-allowed resize-none placeholder-black/40 text-black  transition-all duration-300 ease-in-out ${
                    errors.address
                      ? `border-2 border-red-500 ${shake ? "animate-shake" : ""}`
                      : "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  }`}
                  rows={2}
                  placeholder="Select location on map..."
                />

                {typeof errors.address === "string" && (
                  <p className="text-red-500 text-xs -mt-0.5 italic">{errors.address}</p>
                )}
                <MapPin className="absolute left-3 top-5.5 -translate-y-1/2 text-stone-500" size={18} />
              </div>
              <p className={`${subText} text-xs mt-1 italic`}>Address is automatically updated when you move the map marker.</p>
            </div>

            <div className="pt-4 space-y-3">
              <button
                type="button"
                onClick={() => {
                  if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition((pos) => {
                      const newLoc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
                      setFormData(prev => ({ ...prev, ...newLoc }));
                    });
                  }
                }}
                className={`${UmCL} gradient-text cursor-pointer border border-blue-700 w-full py-2.5 px-4 rounded-xl font-medium flex items-center justify-center gap-2 transition-all duration-300 ease-in-out hover:scale-102 active:scale-95`}
              >
                <MapPin size={18} className="text-blue-700"/>
                Use My Current Location
              </button>
              
              <button
                type="submit"
                className="gradient-bg shadow-inner hover:shadow-innerWH w-full py-3 px-4 text-white rounded-xl font-semibold transition-all duration-300 ease-in-out cursor-pointer hover:scale-102 active:scale-95"
              >
                Book Appointment
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Map Section */}
      <div className={`${bgCon} lg:col-span-7 h-125 lg:h-auto min-h-100 rounded-2xl overflow-hidden border border-stone-200 relative transition-all duration-300 ease-in-out`}>
        <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''}>
          <MapContainer 
            lat={formData.lat} 
            lng={formData.lng}
            DEFAULT_CENTER={DEFAULT_CENTER}
            onLocationChange={(lat, lng, address) => {
              setFormData(prev => ({ ...prev, lat, lng, address }));
            }} 
          />
        </APIProvider>
      </div>
    </motion.div>
  );
}