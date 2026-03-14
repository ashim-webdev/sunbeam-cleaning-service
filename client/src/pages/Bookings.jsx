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
  UserCircle 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';


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
  const [view, setView] = useState('client');
  const [bookings, setBookings] = useState([]);
  
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

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans">
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
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200">
                  <h2 className="text-2xl font-semibold mb-6">Book a Cleaning</h2>
                  
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      addBooking(formData);
                    }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                        <input
                          required
                          type="text"
                          value={formData.clientName}
                          onChange={e => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
                          className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none"
                          placeholder="John Doe"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1">Phone Number</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                        <input
                          required
                          type="tel"
                          value={formData.phoneNumber}
                          onChange={e => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                          className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none"
                          placeholder="+1 (555) 000-0000"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1">Service Type</label>
                      <select
                        value={formData.service}
                        onChange={e => setFormData(prev => ({ ...prev, service: e.target.value }))}
                        className="w-full px-4 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none appearance-none"
                      >
                        {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1">Service Address</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                        <textarea
                          readOnly
                          value={formData.address}
                          className="w-full pl-10 pr-4 py-2 bg-stone-100 border border-stone-200 rounded-xl text-stone-600 cursor-not-allowed resize-none"
                          rows={2}
                          placeholder="Select location on map..."
                        />
                      </div>
                      <p className="text-xs text-stone-500 mt-1 italic">Address is automatically updated when you move the map marker.</p>
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
                        className="w-full py-2.5 px-4 bg-stone-100 text-stone-700 rounded-xl font-medium hover:bg-stone-200 transition-colors flex items-center justify-center gap-2"
                      >
                        <MapPin size={18} />
                        Use My Current Location
                      </button>
                      
                      <button
                        type="submit"
                        className="w-full py-3 px-4 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-all shadow-md shadow-emerald-200 active:scale-[0.98]"
                      >
                        Book Appointment
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              {/* Map Section */}
              <div className="lg:col-span-7 h-125 lg:h-auto min-h-100 rounded-2xl overflow-hidden border border-stone-200 shadow-sm relative">
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
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold">Booking Dashboard</h2>
                <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium">
                  {bookings.length} Total Bookings
                </span>
              </div>

              {bookings.length === 0 ? (
                <div className="bg-white border border-dashed border-stone-300 rounded-2xl p-12 text-center">
                  <div className="bg-stone-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-stone-400">
                    <Calendar size={32} />
                  </div>
                  <h3 className="text-lg font-medium text-stone-900">No bookings yet</h3>
                  <p className="text-stone-500">New bookings will appear here as clients submit the form.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {bookings.map(booking => (
                    <div key={booking.id} className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">{booking.clientName}</h3>
                          <p className="text-sm text-stone-500 flex items-center gap-1">
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
            className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl shadow-lg focus:ring-2 focus:ring-emerald-500 outline-none pr-10"
          />
          <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
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
