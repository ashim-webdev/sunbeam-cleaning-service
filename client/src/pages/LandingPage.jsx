import React, { useEffect } from 'react'
import { useLocation } from "react-router-dom";
import Navbar from '../components/LandingPageComponents/Navbar';
import Hero from '../components/LandingPageComponents/Hero';
import Features from '../components/LandingPageComponents/Features';
import About from '../components/LandingPageComponents/About';
import WhyChooseUs from '../components/LandingPageComponents/WhyChooseUs';
import Pricing from '../components/LandingPageComponents/Pricing';
import Gallery from '../components/LandingPageComponents/Gallery';
import Testimonials from '../components/LandingPageComponents/Testimonials';
import { CtaBanner } from '../components/LandingPageComponents/Footer';
import Footer from '../components/LandingPageComponents/Footer';
import "../components/LandingPageComponents/landingPage.css"
import BeforeAfterSlider from '../components/LandingPageComponents/BeforeAfterSlider';
import BookingForm from '../components/LandingPageComponents/BookingForm';





export default function LandingPage() {
  const location = useLocation();

  useEffect(() => {
    const widget = document.querySelector(".elfsight-app-6ba9c022-56e0-401d-8994-095d315da791");

    if (widget) {
      widget.style.display = location.pathname === "/" ? "block" : "none";
    }
  }, [location.pathname]);

  return (
    <div className="landingPage min-h-screen overflow-hidden relative">
      <Navbar />
      <main>
        <Hero />
        <About />
        <BeforeAfterSlider />
        <Features />
        <BookingForm />
        {/* <WhyChooseUs /> */}
        <Pricing />
        {/* <Gallery /> */}
        <Testimonials />
        <CtaBanner />
      </main>
      <Footer />

      <div className='fixed bottom-0 right-0'>
        <div class="elfsight-app-6ba9c022-56e0-401d-8994-095d315da791" data-elfsight-app-lazy></div>
      </div>
    </div>
  );
}
