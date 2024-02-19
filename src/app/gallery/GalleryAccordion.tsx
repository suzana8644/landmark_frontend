import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { superEvents } from "../../../raw-data/dummyEvents";
import Image from "next/image";

const GalleryAccordion = () => {
  const router = useRouter();

  const [activeAccordion, setActiveAccordion] = useState(
    Array(superEvents.length).fill(false),
  );

  const toggleAccordion = (index: number) => {
    const newActiveAccordion = [...activeAccordion];
    newActiveAccordion[index] = !newActiveAccordion[index];
    setActiveAccordion(newActiveAccordion);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {superEvents?.map((event, index) => (
        <div key={index} className="border rounded overflow-hidden">
          <div className="flex flex-col items-center gap-2 p-3">
            <div className="flex justify-center">
              <Image
                src={event.image}
                height={200}
                width={200}
                alt={event.title}
              />
            </div>
            <span
              className={`font-bold text-xl md:text-2xl ${
                activeAccordion[index] && "text-landmark-dark"
              }`}
            >
              {event.title}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GalleryAccordion;
