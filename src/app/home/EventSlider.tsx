"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { AccessTime, KeyboardArrowRight, MenuBook } from "@mui/icons-material";

const superEvents = [
  {
    id: 1,
    title: "Mehendi Function",
    image: "/images/events/mehendi.png",
    description:
      "Traditional Mehendi decor - Yellow Theme design",
  },
  {
    id: 2,
    title: "Weaning Ceremony",
    image: "/images/events/weaning.png",
    description:
      "Traditional Weaning decor - Everything you need for baby",
  },
  {
    id: 3,
    title: "Baby Shower Decor",
    image: "/images/events/babyShower.png",
    description:
      "Every kind of Baby Shower Themed ",
  },
];

const EventSlider = () => {
  const router = useRouter();
  return (
    <div className="flex flex-col gap-3 md:gap-5">
      <div className="flex flex-col relative items-center justify-center">
        <span className="text-2xl md:text-3xl font-black text-center">
          Glimpses of our past works
        </span>
        <button
          onClick={() => router.push("/gallery")}
          className="md:absolute  flex items-center text-xs md:text-lg mt-2 md:mt-0 right-0 top-[10px] md:top-0 rounded-[26px] py-[5px] px-[16px] bg-[#fff] bg-opacity-50 border border-landmark-dark md:rounded-[26px] md:py-[5px] md:px-[20px]"
        >
          Checkout all
          <KeyboardArrowRight />
        </button>
      </div>
      <div className="grid mt-[2rem] grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
        {superEvents.map((event, index) => (
          <div
            key={index}
            className="flex flex-col gap-3 p-3 md:p-5 items-center justify-between rounded-[40px] cursor-pointer shadow-lg hover:shadow-2xl "
            // style={{ boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px" }}
            onClick={() => router.push(`events/${event.id}`)}
          >
            <div className="h-[30%] w-[100%] md:w-[80%] flex items-center justify-center mt-5">
              <Image
                src={event.image}
                height={index === 1 ? "250" : "150"}
                width={index === 1 ? "250" : "150"}
                alt={event.title}
              />
            </div>
            <span className="text-lg md:text-xl mt-3 md:mt-5 font-bold text-center">
              {event.title}
            </span>
            <span className="text-sm text-center">{event.description}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventSlider;
