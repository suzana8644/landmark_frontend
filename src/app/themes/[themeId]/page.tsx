"use client";
import React, {useEffect, useState} from 'react';
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import Image from "next/image";

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

const ThemePage = () => {
    const [orders, setOrders] = useState([]);






    const handlePayment = async (payment_method: string) => {
        const url = `${process.env.NEXT_PUBLIC_API_KEY}/orders/create`;
        console.log(url);
        const data = {
            amount: 100,
            products: [{ product: "test", amount: 100, quantity: 1 }],
            payment_method,
        };
        console.log(data);
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

    useEffect(() => {
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
                        response.statusText
                    );
                }
            } catch (error) {
                console.error("Error during fetch:", error);
            }
        };
        getOrders();
    }, []);


    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
    };
    const images = [
        { url: '/images/events/weaning.png', alt: 'Image 1' },
        { url: '/images/events/weaning.png', alt: 'Image 2' },
        { url: '/images/events/weaning.png', alt: 'Image 3' }
    ];

    return (
        <div className="flex flex-col h-full py-6">
            <div>
                <h1 className="text-xl font-bold py-8">Gorgeous Mehendi Theme</h1>
                <div className={"container"}>
                    <Swiper
                        navigation
                        pagination={{ type: 'fraction' }}
                        modules={[Navigation, Pagination]}
                        onSwiper={swiper => console.log(swiper)}
                        className='h-96 w-full rounded-lg'
                    >
                        {images.map((image, index) => (
                            <SwiperSlide key={index}>
                                <div className='flex h-full items-center justify-center'>
                                    <Image
                                        width={1000}
                                        height={1500}
                                        src={image.url}
                                        alt={image.alt}
                                        className='block h-full w-full object-cover'
                                    />
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
                <div className={"flex flex-vertical"}>
                    <div className={"mt-4 py-6"}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                    </div>
                </div>
                <div>
                    <button className={"bg-landmark-dark text-white rounded-lg py-2 px-4"}>Book Now</button>
                    <button
                        className={"bg-green-700 text-white rounded-lg py-2 px-4 ml-4"}
                        onClick={() => handlePayment("esewa")}
                    >
                        Pay for the event
                    </button>
                    <div className={"flex flex-row-reverse"}>
                        <Image
                            className={"ml-4"}
                            alt={"whatsapp"}
                            width={23}
                            height={23}
                            src={"/images/whatsapp.png"}/>

                        <p>Connect with Organizer: </p>
                        </div>
                </div>
            </div>
        </div>
    )
}

export default ThemePage