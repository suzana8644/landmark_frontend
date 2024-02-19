"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";

interface EventCategory {
  eventCategoryId: string;
  name: string;
  description: string;
  image: string;
  themes: Theme[];
}

interface Theme {
  themeId: string;
  name: string;
  image: string;
  description: string;
  price: number;
  additionalDetails: string;
  organizerId: string;
  eventCategoryId: string;
}

interface Image {
  imageId: string;
  url: string;
  themeId: string;
  theme: Theme;
}

interface ThemeImages {
  themeId: string;
  images: Image[];
}

const IndividualEventPage = () => {
  const [imageLoaded, setImageLoaded] = useState(false); // State to track if the image is loaded

  const [eventCategory, setEventCategory] = useState<EventCategory | null>(
    null,
  );
  const [themes, setThemes] = useState<Theme[] | null>(null);
  const [images, setImages] = useState<ThemeImages[]>([]);
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          `/api/fetchCategories?eventCategoryId=${params?.eventCategoryId}`,
        );
        if (!response.ok) {
          throw new Error("Failed to fetch event categories");
        }
        const data = await response.json();
        setEventCategory(data);
      } catch (error) {
        console.error("Error fetching organizer data:", error);
      }
    };
    const fetchThemesAndImages = async () => {
      try {
        const allImages = [];
        const url = `/api/fetchThemes?eventCategoryId=${params?.eventCategoryId}`;
        const response = await fetch(url, {
          cache: "no-cache",
        });
        const data = await response.json();
        setThemes(data);

        // Iterate through fetched themes and fetch images for each theme
        for (const theme of data) {
          const imageResponse = await fetch(
            `/api/fetchImages?themeId=${theme.themeId}`,
            {
              cache: "no-cache",
            },
          );
          if (!imageResponse.ok) {
            throw new Error(
              "Failed to fetch images for theme with ID: " + theme.themeId,
            );
          }
          const images = await imageResponse.json();
          allImages.push({ themeId: theme.themeId, images });
          setImages(allImages);
          setImageLoaded(true);
        }
      } catch (error) {
        console.error("Error fetching themes and images: ", error);
      }
    };
    fetchThemesAndImages();
    fetchCategories();
  }, []);

  console.log(images);

  return (
    <div className="flex flex-col gap-10">
      <span className="text-3xl font-black text-center">
        Select a theme for your {eventCategory?.name}
      </span>
      <div className={"flex flex-row gap-10 justify-between"}>
        <div className={"container"}>
          {!imageLoaded && (
            <div className="placeholder">Loading...</div> // Show a placeholder until the image is loaded
          )}
          <Image
            src={images[0]?.images[0].url}
            height={300}
            width={400}
            alt={`Image for Event Category`}
            className={`w-full h-auto ${imageLoaded ? "visible" : "hidden"}`} // Show the image only when it's loaded
          />
        </div>
        <div>
          <div className={"text-black"}>{eventCategory?.description}</div>
        </div>
      </div>
      <>
        <div className="flex flex-wrap mt-5">
          {themes?.map((theme, index) => (
            <div
              key={index}
              className="w-1/3 flex flex-col items-center rounded-lg p-2 cursor-pointer shadow-md hover:shadow-2xl box-border mb-[20px] mr-[20px]"
              style={{
                width: "calc(33.33% - 20px)",
              }}
              onClick={() => router.push(`/themes/${theme.themeId}`)}
            >
              {images[index]?.images[0] && (
                <Image
                  src={images[index]?.images[0].url}
                  height={200}
                  width={200}
                  alt={`Image for Theme ${theme.themeId}`}
                  className="w-full h-auto"
                />
              )}
              <div className="flex flex-col justify-between w-[100%] gap-2 p-2 ">
                <div className="flex items-center justify-between w-[100%]">
                  <span className="text-base font-bold">{theme.name}</span>
                  <div className="flex gap-2 items-center">
                    <span className="font-thin text-xs"></span>
                  </div>
                </div>
                <span className="text-sm">{theme.description}</span>
              </div>
            </div>
          ))}
        </div>
      </>
    </div>
  );
};

export default IndividualEventPage;
