"use client";

import React, { useRef } from "react";
import EventAccordion from "./EventAccordion";

const EventsPage = () => {
  const playerRef = useRef(null);
  return (
    <div className="flex flex-col gap-10">
      <span className="text-3xl font-black text-center">Events</span>
      <EventAccordion />
    </div>
  );
};

export default EventsPage;
