import React, { useState } from "react";
import { useRouter } from "next/navigation";

import { superEvents } from "../../../raw-data/dummyEvents";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Add, Remove } from "@mui/icons-material";
import Image from "next/image";

const EventAccordion = () => {
  const router = useRouter();

  const [activeAccordion, setActiveAccordion] = useState(
    Array(superEvents.length).fill(false)
  );

  const toggleAccordion = (index: number) => {
    const newActiveAccordion = [...activeAccordion];
    newActiveAccordion[index] = !newActiveAccordion[index];
    setActiveAccordion(newActiveAccordion);
  };

  return (
    <div>
      {superEvents?.map((event, index) => (
        <Accordion key={index} expanded={activeAccordion[index]}>
          <AccordionSummary
            expandIcon={
              <div
                className="expand-icon hover:bg-gray-200 "
                onClick={() => toggleAccordion(index)}
              >
                {activeAccordion[index] ? <Remove color="primary" /> : <ArrowForwardIosIcon />}
              </div>
            }
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <div
              className="flex flex-col md:flex-row items-center gap-4 md:gap-10 w-full md:p-3 md:p-5"
              onClick={() => router.push(`eventCategories/${event.id}`)}
            >
              <div className="flex w-1/2 w-[100%] md:w-[30%] justify-center">
                <Image
                  src={event.image}
                  height={200}
                  width={200}
                  alt={event.title}
                />
              </div>
              <div className="flex flex-col gap-2 w-1/2 w-[100%] md:w-[70%] justify-center">
                <span
                  className={`font-bold text-xl md:text-2xl ${
                    activeAccordion[index] && "text-landmark-dark"
                  }`}
                >
                  {event.title}
                </span>
                <div className="flex justify-between w-full">
                  <div className="flex items-center gap-2">
                  </div>
                </div>
                <span className="text-xs md:text-sm">{event.description}</span>
              </div>
            </div>
          </AccordionSummary>
          <AccordionDetails>
            <div className="flex md:flex-row flex-col gap-4 md:w-[100%]">
            </div>
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
};

export default EventAccordion;
