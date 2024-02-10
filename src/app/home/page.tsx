"use client";

import React, { useEffect } from "react";
import IntroComponent from "./IntroComponent";
import LandmarkDecorQuestion from "./LandmarkDecorQuestion";
import EventSlider from "./EventSlider";

const HomePage = () => {
  useEffect(() => {
    const isAboutUs = localStorage.getItem("aboutUs");
    if (isAboutUs && isAboutUs === "true") {
      const sectionElement = document.getElementById("about-us-section");
      if (sectionElement) {
        sectionElement.scrollIntoView({ behavior: "smooth" });
      }
      localStorage.removeItem("aboutUs");
    }
  }, []);

  return (
    <div className="flex flex-col gap-10 md:gap-[5rem]">
      <IntroComponent />
      <LandmarkDecorQuestion />
      <EventSlider/>
    </div>
  );
};

export default HomePage;
