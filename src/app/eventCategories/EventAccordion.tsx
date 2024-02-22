import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { Add, Remove } from "@mui/icons-material";
import Image from "next/image";
import { Theme, EventCategory, EventImage } from "../../../utils/interfaces";

const EventAccordion = () => {
  const [eventCategories, setEventCategories] = useState<
    EventCategory[] | null
  >(null);
  const [images, setImages] = useState<EventImage[]>();
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`/api/fetchCategories`);
        if (!response.ok) {
          throw new Error("Failed to fetch events categories");
        }
        const data = await response.json();
        setEventCategories(data);
      } catch (error) {
        console.error("Error fetching organizer data:", error);
      }
    };
    const fetchEventImages = async () => {
      try {
        const response = await fetch(`/api/fetchEventImages`);
        if (!response.ok) {
          throw new Error("Failed to fetch events categories");
        }
        const data = await response.json();
        setImages(data);
      } catch (error) {
        console.error("Error fetching organizer data:", error);
      }
    };
    fetchCategories();
    fetchEventImages();
  }, []);
  console.log(eventCategories);

  const router = useRouter();

  const [activeAccordion, setActiveAccordion] = useState(
    Array(eventCategories?.length).fill(false),
  );

  const toggleAccordion = (index: number) => {
    const newActiveAccordion = [...activeAccordion];
    newActiveAccordion[index] = !newActiveAccordion[index];
    setActiveAccordion(newActiveAccordion);
  };

  // @ts-ignore
  return (
    <div>
      {eventCategories?.map((eventCategory, index) => (
        <Accordion key={index} expanded={activeAccordion[index]}>
          <AccordionSummary
            expandIcon={
              <div
                className="expand-icon hover:bg-gray-200 "
                onClick={() => toggleAccordion(index)}
              >
                {activeAccordion[index] ? (
                  <Remove color="primary" />
                ) : (
                  <ArrowForwardIosIcon />
                )}
              </div>
            }
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <div
              className="flex flex-col md:flex-row items-center gap-4 md:gap-10 w-full md:p-3 md:p-5"
              onClick={() =>
                router.push(`/eventCategory/${eventCategory.eventCategoryId}`)
              }
            >
              <div className="flex w-1/2 w-[100%] md:w-[30%] justify-center">
                <Image
                  src={images ? images[index].url : "" || ""}
                  height={200}
                  width={200}
                  alt={eventCategory.name}
                />
              </div>
              <div className="flex flex-col gap-2 w-1/2 w-[100%] md:w-[70%] justify-center">
                <span
                  className={`font-bold text-xl md:text-2xl ${
                    activeAccordion[index] && "text-landmark-dark"
                  }`}
                >
                  {eventCategory.name}
                </span>
                <div className="flex justify-between w-full">
                  <div className="flex items-center gap-2"></div>
                </div>
                <span className="text-xs md:text-sm">
                  {eventCategory.description}
                </span>
              </div>
            </div>
          </AccordionSummary>
          <AccordionDetails>
            <div className="flex md:flex-row flex-col gap-4 md:w-[100%]"></div>
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
};

export default EventAccordion;
