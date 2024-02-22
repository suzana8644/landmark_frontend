"use client";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import Image from "next/image";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useParams } from "next/navigation";
import { Theme, ThemeImage, Organizer } from "../../../../utils/interfaces";

const ThemePage = () => {
  const params = useParams();
  const themeId = params?.themeId;
  const [images, setImages] = useState<ThemeImage[]>([]);
  const [orders, setOrders] = useState([]);
  const [theme, setTheme] = useState<Theme | null>(null);
  const [organizer, setOrganizer] = useState<Organizer | null>(null);

  useEffect(() => {
    const getTheme = async () => {
      try {
        const response = await fetch(
          `/api/fetchThemes?themeId=${params?.themeId}`,
          {
            cache: "no-cache",
          },
        );
        const data = await response.json();
        setTheme(data);
      } catch (error) {
        console.error("Error fetching theme data:", error);
      }
    };
    const getOrders = async () => {
      const url = `${process.env.NEXT_PUBLIC_API_KEY}/api/orders`;

      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // Add any other headers as needed
          },
        });

        // Check if the request was successful (status code 2xx)
        if (response.ok) {
          const responseData = await response.json();
          console.log(responseData);
          setOrders(responseData);
        } else {
          console.error(
            "Failed to fetch:",
            response.status,
            response.statusText,
          );
        }
      } catch (error) {
        console.error("Error during fetch:", error);
      }
    };
    const fetchImages = async () => {
      try {
        const response = await fetch(
          `/api/fetchThemeImages?themeId=${themeId}`,
        );
        if (!response.ok) {
          throw new Error("Failed to fetch images");
        }
        const data = await response.json();
        setImages((prevImages) => [...prevImages, ...data]);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchImages();
    getTheme();
    getOrders();
  }, []);

  useEffect(() => {
    const fetchOrganizer = async () => {
      try {
        console.log("Organizer ID", theme?.organizerId);
        const response = await fetch(
          `/api/fetchOrganizers?organizerId=${theme?.organizerId}`,
        );
        if (!response.ok) {
          throw new Error("Failed to fetch organizer data");
        }
        const data = await response.json();
        setOrganizer(data);
      } catch (error) {
        console.error("Error fetching organizer data:", error);
      }
    };
    fetchOrganizer();
  }, [theme]);
  console.log(images);

  const handleWhatsapp = () => {
    window.open(`https://wa.me/${organizer?.whatsappId}`, "_blank");
  };

  const handlePayment = async (payment_method: string) => {
    const url = `${process.env.NEXT_PUBLIC_API_KEY}/orders/create`;
    const data = {
      amount: `${theme?.price}`,
      products: [{ product: "test", amount: `${theme?.price}`, quantity: 1 }],
      payment_method,
    };
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Add any other headers as needed
        },
        body: JSON.stringify(data),
      });

      // Check if the request was successful (status code 2xx)
      if (response.ok) {
        const responseData = await response.json();
        console.log(responseData);
        if (responseData.payment_method === "esewa") {
          esewaCall(responseData.formData);
        }
      } else {
        console.error("Failed to fetch:", response.status, response.statusText);
      }
    } catch (error) {
      console.error("Error during fetch:", error);
    }
  };
  const esewaCall = (formData: any) => {
    console.log(formData);
    var path = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";

    var form = document.createElement("form");
    form.setAttribute("method", "POST");
    form.setAttribute("action", path);

    for (var key in formData) {
      var hiddenField = document.createElement("input");
      hiddenField.setAttribute("type", "hidden");
      hiddenField.setAttribute("name", key);
      hiddenField.setAttribute("value", formData[key]);
      form.appendChild(hiddenField);
    }

    document.body.appendChild(form);
    form.submit();
  };

  useEffect(() => {}, []);
  return (
    <div className="flex flex-col h-full py-6">
      <div>
        {theme ? (
          <h1 className="text-xl font-bold py-8">{theme.name}</h1>
        ) : (
          <div>Loading theme data...</div>
        )}
        {images ? (
          <div className={"container"}>
            <Swiper
              navigation
              pagination={{ type: "fraction" }}
              modules={[Navigation, Pagination]}
              onSwiper={(swiper) => console.log(swiper)}
              className="h-96 w-full rounded-lg"
            >
              {images.map((image, index) => (
                <SwiperSlide key={index}>
                  <div className="flex h-full items-center justify-center">
                    <Image
                      width={1000}
                      height={1500}
                      src={image.url}
                      alt={"Image"}
                      className="block h-full w-full object-cover"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        ) : (
          <div>Loading images...</div>
        )}
        <div className={"flex flex-vertical"}>
          {theme ? (
            <div className="mt-4 py-6">{theme.description}</div>
          ) : (
            <div>Loading description...</div>
          )}
        </div>
        <div>
          <button
            className={"bg-landmark-dark text-white rounded-lg py-2 px-4"}
            onClick={() => handlePayment("esewa")}
          >
            Pay to connect with the organizer
          </button>
          <div className={"flex flex-row-reverse"}>
            <Image
              onClick={handleWhatsapp}
              className={"ml-4"}
              alt={"whatsapp"}
              width={23}
              height={23}
              src={"/images/whatsapp.png"}
            />

            <p>Connect with Organizer: </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemePage;
