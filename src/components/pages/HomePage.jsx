import React, { useRef, useEffect } from "react";
import Header from "../Home/Header.jsx";
import DiagnosticService from "../Home/DiagnosticService.jsx";
import WhyChoose from "../Home/WhyChoose.jsx";
import { useLocation } from "react-router-dom";
import Offer from "../Home/Offer.jsx";


const HomePage = () => {
  const location = useLocation();
  const diagnosticServiceRef = useRef(null);

  const showDiagnosticService = location.state?.showDiagnosticService || false;

  useEffect(() => {
    if (showDiagnosticService && diagnosticServiceRef.current) {
      diagnosticServiceRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [showDiagnosticService]);

  return (
    <div>
      
      <Header />
      <Offer/>
      <div ref={diagnosticServiceRef}>
        <DiagnosticService />
      </div>
      <WhyChoose />
    </div>
  );
};

export default HomePage;
