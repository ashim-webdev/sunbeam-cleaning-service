
import { useSelector } from "react-redux";
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
} from 'lucide-react';






export default function MapContainer({ lat, lng, onLocationChange, DEFAULT_CENTER }) {
  const { LightMode } = useSelector((state) => state.auth);
  const [markerPos, setMarkerPos] = useState({ lat, lng });
  const mapsLibrary = useMapsLibrary('geocoding');
  const placesLibrary = useMapsLibrary('places');
  const isLoaded = useApiIsLoaded();
  const mapRef = useRef(null);
  const searchInputRef = useRef(null);



  // Reverse Geocoding
const updateAddress = useCallback(
  async (newLat, newLng) => {

    // fallback when no API key
    if (!mapsLibrary) {
      onLocationChange(
        newLat,
        newLng,
        `${newLat.toFixed(6)}, ${newLng.toFixed(6)}`
      );
      return;
    }

    const geocoder =
      new mapsLibrary.Geocoder();

    try {
      const response =
        await geocoder.geocode({
          location: {
            lat: newLat,
            lng: newLng,
          },
        });

      if (response.results[0]) {
        onLocationChange(
          newLat,
          newLng,
          response.results[0]
            .formatted_address
        );
      }
    } catch (error) {
      console.error(
        "Geocoding failed:",
        error
      );

      onLocationChange(
        newLat,
        newLng,
        `${newLat.toFixed(6)}, ${newLng.toFixed(6)}`
      );
    }
  },
  [mapsLibrary, onLocationChange]
);



  // Update marker when props change (e.g. from "Use My Location")
  useEffect(() => {
    setMarkerPos({ lat, lng });
  }, [lat, lng]);

  // Automatically update address when coordinates change
  useEffect(() => {
    if (lat && lng) {
      updateAddress(lat, lng);
    }
  }, [lat, lng, updateAddress]);


  
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