/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { AnimatePresence } from 'framer-motion';
import { useSelector } from "react-redux";
import { useCreateBookingMutation } from '../../redux/slices/api/bookingApiSlice';
import LandingPageForm from './Form&Map/LandingPageForm';



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


const DEFAULT_CENTER = {
  lat: 9.0765,
  lng: 7.3986
}; // Abuja

// --- Components ---

export default function BookingForm() {
  const { LightMode } = useSelector((state) => state.auth);

  const [createBooking, { isLoading }] = useCreateBookingMutation();
  
  const [view, setView] = useState('client');
  const [errors, setErrors] = useState({});
  const [shake, setShake] = useState(false);
  // image field
  const [images, setImages] = useState([]);
  


  useEffect(() => {
    return () => {
      images.forEach((file) => URL.revokeObjectURL(file.preview));
    };
  }, [images]);

  const handleSelect = (e) => {
    const files = Array.from(e.target.files);

    const imageFiles = files
      .filter((file) => file.type.startsWith("image/"))
      .map((file) => {
        return Object.assign(file, {
          preview: URL.createObjectURL(file),
        });
      });

    setImages(imageFiles);

    // reset input so same file can be selected again if needed
    e.target.value = null;
  };
  
  // Form State
  const [formData, setFormData] = useState({
    clientName: '',
    phoneNumber: '',
    property: PROPERTY[0],
    service: SERVICES[0],
    address: '',
    lat: DEFAULT_CENTER.lat,
    lng: DEFAULT_CENTER.lng
  });



  const addBooking = async () => {
    try {
      const data = new FormData();

      data.append(
        "clientName",
        formData.clientName
      );

      data.append(
        "phoneNumber",
        formData.phoneNumber
      );

      data.append(
        "property",
        formData.property
      );

      data.append(
        "service",
        formData.service
      );

      data.append(
        "address",
        formData.address
      );

      data.append(
        "lat",
        formData.lat
      );

      data.append(
        "lng",
        formData.lng
      );

      images.forEach((img) => {
        data.append("images", img);
      });

      await createBooking(data).unwrap();

      toast.success("Booking successful");

      setImages([]);

    } catch (error) {
      toast.error(
        error?.data?.message ||
        "Failed to create booking"
      );
    }
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

  return (
    <div className={`${bg} min-h-screen text-stone-900 font-sans transition-all duration-300 ease-in-out`}>

      <main className="max-w-7xl mx-auto p-4 md:p-8">
        <AnimatePresence mode="wait">
          <LandingPageForm
            formData={formData}
            setFormData={setFormData}
            errors={errors}
            setErrors={setErrors}
            shake={shake}
            images={images}
            setImages={setImages}
            handleSelect={handleSelect}
            validateBooking={validateBooking}
            addBooking={addBooking}
            LightMode={LightMode}
            DEFAULT_CENTER={DEFAULT_CENTER}
          />
        </AnimatePresence>
      </main>
    </div>
  );
}


