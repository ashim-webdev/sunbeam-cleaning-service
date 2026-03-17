/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  APIProvider, 
  Map, 
  AdvancedMarker, 
  useApiIsLoaded,
  useMapsLibrary
} from '@vis.gl/react-google-maps';
import { 
  MapPin, 
  Phone, 
  User, 
  Sparkles, 
  Calendar, 
  ExternalLink, 
  LayoutDashboard, 
  UserCircle,
  ChevronDown,
  ChevronsUp
} from 'lucide-react';
import { Listbox, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from "react-redux";



const SERVICES = [
  'Basic Cleaning',
  'Deep Cleaning',
  'Office Cleaning',
  'Move In/Out Cleaning',
  'Window Cleaning'
];

const DEFAULT_CENTER = { lat: 40.7128, lng: -74.0060 }; // New York City

// --- Components ---

export default function Bookings() {
  const { LightMode } = useSelector((state) => state.auth);
  
  const [view, setView] = useState('client');
  const [bookings, setBookings] = useState([]);

  const [errors, setErrors] = useState({});
  const [shake, setShake] = useState(false);
  const [toggle, setToggle] = useState(false);

  
  // Form State
  const [formData, setFormData] = useState({
    clientName: '',
    phoneNumber: '',
    service: SERVICES[0],
    address: '',
    lat: DEFAULT_CENTER.lat,
    lng: DEFAULT_CENTER.lng
  });

  const addBooking = (booking) => {
    console.log(booking)
    const newBooking = {
      ...booking,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString()
    };
    setBookings(prev => [newBooking, ...prev]);
    // Reset form but keep location
    setFormData(prev => ({
      ...prev,
      clientName: '',
      phoneNumber: '',
    }));
    alert('Booking successful!');
  };


  const validateBooking = () => {
    const newErrors = {};

    const triggerShake = () => {
      setShake(true);

      if (navigator.vibrate) {
        navigator.vibrate(300);
      }

      setTimeout(() => setShake(false), 1000);
    };

    const { clientName, phoneNumber, address } = formData;

    const allEmpty =
      !clientName.trim() &&
      !phoneNumber.trim() &&
      !address.trim();

    if (allEmpty) {
      toast.error("All fields are required");
      newErrors.clientName = "Full name is required";
      newErrors.phoneNumber = "Phone number is required";
      newErrors.address = "Address is required";
      setErrors(newErrors);
      triggerShake();
      return false;
    }

    if (!clientName.trim()) {
      newErrors.clientName = "Full name is required";
      toast.error("Full name is required");
      triggerShake();
    } else if (!phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
      toast.error("Phone number is required");
      triggerShake();
    } else if (!address.trim()) {
      newErrors.address = "Please select a location on the map";
      toast.error("Address is required");
      triggerShake();
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const bg = LightMode ? "bg-white/60 shadow-darkSM" : "bg-black/60 shadow-lightSM";
  const bgCon = LightMode ? "bg-white shadow-darkSM" : "bg-black/90 shadow-lightSM";
  const subText = LightMode ? "text-black/80" : "text-white/80"
  const shadow = LightMode ? "shadow-darkSM" : "shadow-lightSM";
  const text = LightMode ? "text-black" : "text-white";
  const UmCL = LightMode ? "bg-stone-100 text-stone-700 hover:bg-stone-200" : "bg-stone-400 text-stone-100 hover:bg-stone-500";

  return (
    <div className={`${bg} min-h-screen text-stone-900 font-sans transition-all duration-300 ease-in-out`}>
      {/* Header */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex flex-col sm:flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-emerald-600 p-2 rounded-lg text-white">
              <Sparkles size={20} />
            </div>
            <h1 className="text-xl font-semibold tracking-tight">SparkleClean</h1>
          </div>

          <div className="flex bg-stone-100 p-1 rounded-xl">
            <button
              onClick={() => setView('client')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                view === 'client' 
                ? 'bg-white text-emerald-700 shadow-sm' 
                : 'text-stone-500 hover:text-stone-700'
              }`}
            >
              <UserCircle size={16} />
              Client
            </button>
            <button
              onClick={() => setView('admin')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                view === 'admin' 
                ? 'bg-white text-emerald-700 shadow-sm' 
                : 'text-stone-500 hover:text-stone-700'
              }`}
            >
              <LayoutDashboard size={16} />
              Admin
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 md:p-8">
        <AnimatePresence mode="wait">
          {view === 'client' ? (
            <motion.div
              key="client"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8"
            >
              {/* Booking Form */}
              <div className="lg:col-span-5 space-y-6">
                <div className={`${bgCon} p-6 rounded-2xl border border-stone-200 transition-all duration-300 ease-in-out`}>
                  <h2 className={`${text} text-2xl font-semibold mb-6 transition-all duration-300 ease-in-out`}>Book a Cleaning</h2>
                  
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();

                      if (!validateBooking()) return;

                      addBooking(formData);
                      toast.success("Booking successful!");
                    }}
                    className="space-y-4"
                  >
                    <div>
                      <label className={`block text-sm font-medium ${subText} mb-1 transition-all duration-300 ease-in-out`}>Full Name</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={formData.clientName}
                          onChange={e => {
                            setFormData(prev => ({ ...prev, clientName: e.target.value }));
                            setErrors(prev => ({ ...prev, clientName: null }));
                          }}
                          className={`${LightMode ? "placeholder-black/70 text-black" : "placeholder-white/70 text-white"} w-full pl-10 pr-4 py-2 border rounded-xl outline-none transition-all ${
                            errors.clientName
                              ? `border-2 border-red-500 ${shake ? "animate-shake" : ""}`
                              : "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          }`}
                          placeholder="John Doe"
                        />

                        {errors.clientName && (
                          <p className="text-red-500 text-xs mt-1 italic">{errors.clientName}</p>
                        )}

                        <User className="absolute left-3 top-5.5 -translate-y-1/2 text-stone-400" size={18} />
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
                          className={`${LightMode ? "placeholder-black/70 text-black" : "placeholder-white/70 text-white"} w-full pl-10 pr-4 py-2 border rounded-xl outline-none transition-all duration-300 ease-in-out ${
                            errors.phoneNumber
                              ? `border-2 border-red-500 ${shake ? "animate-shake" : ""}`
                              : "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          }`}
                          placeholder="+1 (555) 000-0000"
                        />

                        {errors.phoneNumber && (
                          <p className="text-red-500 text-xs mt-1 italic">{errors.phoneNumber}</p>
                        )}

                        <Phone className="absolute left-3.5 top-5.5 -translate-y-1/2 text-stone-400" size={18} />
                      </div>
                    </div>

                    <div>
                      <label className={`${subText} block text-sm font-medium mb-1 transition-all duration-300 ease-in-out`}>Service Type</label>
                        <Listbox
                          value={formData.service}
                          onChange={(value) =>
                            setFormData(prev => ({ ...prev, service: value }))
                          }
                        >
                          <div className="relative">
                            
                            {/* Button */}
                            <Listbox.Button
                              onClick={() => setToggle(prev => !prev)}
                              className={`${subText} w-full px-4 py-2 border rounded-xl text-left border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none flex justify-between items-center cursor-pointer`}
                            >
                              <span>{formData.service}</span>
                              <span className="text-black text-sm bg-gray-200 rounded-full p-1">
                                {toggle ? <ChevronsUp size={25} className="font-bold animate-UpDown" /> : <ChevronDown size={25} className="font-bold" />}
                              </span>
                            </Listbox.Button>

                            {/* Options */}
                            {toggle && (
                              <Transition
                                as={Fragment}
                                leave="transition ease-in duration-100"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                              >
                                <Listbox.Options onClick={(e) => e.stopPropagation()} className={`${bgCon} absolute mt-2 w-full border border-stone-200 rounded-xl shadow-lg z-50 overflow-hidden outline-none transition-all duration-300 ease-in-out`}>
                                  {SERVICES.map((service, index) => (
                                    <Listbox.Option
                                      key={index}
                                      value={service}
                                      onClick={() => setToggle(false)}
                                      className={({ active }) =>
                                        `cursor-pointer px-4 py-2 text-sm transition-all duration-300 ease-in-out ${
                                          active ? `${LightMode ? "bg-amber-100 text-amber-900 hover:shadow-dark" : "bg-amber-900 text-amber-100 hover:shadow-light"}` : `${LightMode ? "text-gray-900" : "text-gray-200"}`
                                        }`
                                      }
                                    >
                                      {service}
                                    </Listbox.Option>
                                  ))}
                                </Listbox.Options>
                              </Transition>
                            )}
                            

                          </div>
                        </Listbox>
                    </div>

                    <div>
                      <label className={`${subText} block text-sm font-medium text-stone-700 mb-1`}>Service Address</label>
                      <div className="relative">
                        <textarea
                          readOnly
                          value={formData.address}
                          className={`w-full pl-10 pr-4 py-2 border outline-none rounded-xl text-stone-600 cursor-not-allowed resize-none ${LightMode ? "placeholder-black/70 text-black" : "placeholder-white/70 text-white"} transition-all duration-300 ease-in-out ${
                            errors.address
                              ? `border-2 border-red-500 ${shake ? "animate-shake" : ""}`
                              : "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          }`}
                          rows={2}
                          placeholder="Select location on map..."
                        />

                        {errors.address && (
                          <p className="text-red-500 text-xs -mt-0.5 italic">{errors.address}</p>
                        )}
                        <MapPin className="absolute left-3 top-5.5 -translate-y-1/2 text-stone-400" size={18} />
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
                        className={`ClickAnimationNoti ${UmCL} w-full py-2.5 px-4 rounded-xl font-medium flex items-center justify-center gap-2 transition-all duration-300 ease-in-out`}
                      >
                        <MapPin size={18} />
                        Use My Current Location
                      </button>
                      
                      <button
                        type="submit"
                        className="ClickAnimationNoti shadow-inner hover:shadow-innerWH w-full py-3 px-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-800 active:scale-[0.98] transition-all duration-300 ease-in-out cursor-pointer"
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
                    onLocationChange={(lat, lng, address) => {
                      setFormData(prev => ({ ...prev, lat, lng, address }));
                    }} 
                  />
                </APIProvider>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="admin"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className={`flex items-center justify-between mb-4`}>
                <h2 className={`${text} text-2xl font-semibold transition-all duration-300 ease-in-out`}>Booking Dashboard</h2>
                <span className={`${shadow} bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 ease-in-out`}>
                  {bookings.length} Total Bookings
                </span>
              </div>

              {bookings.length === 0 ? (
                <div className={`${bgCon} border border-dashed border-stone-300 rounded-2xl p-12 text-center transition-all duration-300 ease-in-out`}>
                  <div className={`${shadow} bg-stone-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-black transition-all duration-300 ease-in-out`}>
                    <Calendar size={32} />
                  </div>
                  <h3 className={`${text} text-lg font-medium`}>No bookings yet</h3>
                  <p className={`${subText}`}>New bookings will appear here as clients submit the form.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {bookings.map(booking => (
                    <div key={booking.id} className={`${bgCon} p-6 rounded-2xl border border-stone-200 shadow-sm hover:shadow-md transition-all duration-300 ease-in-out`}>
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">{booking.clientName}</h3>
                          <p className={`${subText} text-sm flex items-center gap-1 transition-all duration-300 ease-in-out`}>
                            <Phone size={14} /> {booking.phoneNumber}
                          </p>
                        </div>
                        <span className="bg-stone-100 text-stone-600 px-2 py-1 rounded text-xs font-medium">
                          {booking.service}
                        </span>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex gap-2 text-sm text-stone-600">
                          <MapPin size={16} className="shrink-0 mt-0.5 text-emerald-600" />
                          <p>{booking.address}</p>
                        </div>
                        
                        <div className="flex items-center gap-2 text-xs text-stone-400 pt-2 border-t border-stone-100">
                          <Calendar size={14} />
                          <span>Booked on {new Date(booking.createdAt).toLocaleString()}</span>
                        </div>

                        <a
                          href={`https://www.google.com/maps?q=${booking.lat},${booking.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full mt-4 flex items-center justify-center gap-2 py-2 px-4 bg-stone-900 text-white rounded-xl text-sm font-medium hover:bg-stone-800 transition-colors"
                        >
                          <ExternalLink size={14} />
                          Open in Google Maps
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

// --- Map Sub-component ---

function MapContainer({ lat, lng, onLocationChange }) {
  const { LightMode } = useSelector((state) => state.auth);
  const [markerPos, setMarkerPos] = useState({ lat, lng });
  const mapsLibrary = useMapsLibrary('geocoding');
  const placesLibrary = useMapsLibrary('places');
  const isLoaded = useApiIsLoaded();
  const mapRef = useRef(null);
  const searchInputRef = useRef(null);

  // Update marker when props change (e.g. from "Use My Location")
  useEffect(() => {
    setMarkerPos({ lat, lng });
  }, [lat, lng]);

  // Reverse Geocoding
  const updateAddress = useCallback(async (newLat, newLng) => {
    if (!mapsLibrary) return;
    
    const geocoder = new mapsLibrary.Geocoder();
    try {
      const response = await geocoder.geocode({ location: { lat: newLat, lng: newLng } });
      if (response.results[0]) {
        onLocationChange(newLat, newLng, response.results[0].formatted_address);
      }
    } catch (error) {
      console.error('Geocoding failed:', error);
    }
  }, [mapsLibrary, onLocationChange]);

  // Handle Marker Drag
  const onMarkerDragEnd = (e) => {
    if (e.latLng) {
      const newLat = e.latLng.lat();
      const newLng = e.latLng.lng();
      setMarkerPos({ lat: newLat, lng: newLng });
      updateAddress(newLat, newLng);
    }
  };

  // Handle Map Click
  const onMapClick = (e) => {
    if (e.latLng) {
      const newLat = e.latLng.lat();
      const newLng = e.latLng.lng();
      setMarkerPos({ lat: newLat, lng: newLng });
      updateAddress(newLat, newLng);
    }
  };

  // Initialize Search Box
  useEffect(() => {
    if (!placesLibrary || !searchInputRef.current || !mapRef.current) return;

    const autocomplete = new placesLibrary.Autocomplete(searchInputRef.current);
    autocomplete.bindTo('bounds', mapRef.current);

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (!place.geometry || !place.geometry.location) return;

      const newLat = place.geometry.location.lat();
      const newLng = place.geometry.location.lng();
      
      setMarkerPos({ lat: newLat, lng: newLng });
      onLocationChange(newLat, newLng, place.formatted_address || '');
      
      if (mapRef.current) {
        mapRef.current.panTo({ lat: newLat, lng: newLng });
        mapRef.current.setZoom(17);
      }
    });
  }, [placesLibrary, onLocationChange]);



  const bg = LightMode ? "bg-white/60 shadow-darkSM" : "bg-black/60 shadow-lightSM";
  const bgCon = LightMode ? "bg-white shadow-darkSM" : "bg-black/90 shadow-lightSM";
  const subText = LightMode ? "text-black/80" : "text-white/80"
  const shadow = LightMode ? "shadow-darkSM" : "shadow-lightSM";
  const text = LightMode ? "text-black" : "text-white";
  const UmCL = LightMode ? "bg-stone-100 text-stone-700 hover:bg-stone-200" : "bg-stone-400 text-stone-100 hover:bg-stone-500";



  if (!isLoaded) {
    return (
      <div className="w-full h-full bg-stone-100 flex items-center justify-center animate-pulse">
        <p className="text-stone-400 font-medium">Loading Map...</p>
      </div>
    );
  }

  return (
    <>
      {/* Search Bar Overlay */}
      <div className="absolute top-4 left-4 right-4 z-10">
        <div className="relative max-w-md mx-auto">
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search for an address..."
            className={`${bgCon} ${LightMode ? "placeholder-black/70 text-black" : "placeholder-white/70 text-white"} border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full px-4 py-3 border rounded-xl outline-none pr-10 transition-all duration-300 ease-in-out`}
          />
          <MapPin className={`${LightMode ? "text-stone-500" : "text-stone-200"} absolute right-3 top-1/2 -translate-y-1/2 transition-all duration-300 ease-in-out`} size={18} />
        </div>
      </div>

      <Map
        defaultCenter={DEFAULT_CENTER}
        center={markerPos}
        defaultZoom={13}
        mapId="DEMO_MAP_ID" // Required for AdvancedMarker
        onClick={onMapClick}
        onCameraChanged={(ev) => {
          // Keep track of map instance
          if (!mapRef.current) {
             // @ts-ignore - accessing internal map instance if needed, but usually we use ref
          }
        }}
        onIdle={(ev) => {
          // @ts-ignore
          mapRef.current = ev.map;
        }}
        className="w-full h-full"
        disableDefaultUI={true}
        zoomControl={true}
      >
        <AdvancedMarker
          position={markerPos}
          draggable={true}
          onDragEnd={onMarkerDragEnd}
        />
      </Map>
    </>
  );
}
