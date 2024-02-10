"use client";

import React, { useState, useEffect } from "react";
import jwt from "jsonwebtoken";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ReactTyped from "react-typed";

interface UserInfo {
  firstname: string;
  lastname: string;
  exp: number;
}

const IntroComponent = () => {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  const userToken =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (userToken) {
      try {
        const user = jwt.decode(userToken) as UserInfo;
        if (user) {
          user && setUserInfo(user);
        }
      } catch (error) {
        console.error("Error decoding JWT:", error);
      }
    }
  }, [userToken]);

  return (
    <div className="flex flex-col">
      <div className="overflow-hidden relative">
        <div className="flex h-[65vh] md:h-[80vh] circularAnimation">
        </div>
        <div className="absolute bottom-10 md:bottom-20 left-5 md:left-20 w-full h-full flex flex-col gap-5 md:gap-10 justify-center">
          <span className="text-4xl md:text-6xl font-semibold">
            An Experience to Remember
          </span>
          <span className="text-4xl md:text-6xl font-semibold">
            and a portal to organizing your
          </span>
            <span className="ml-2 text-2xl md:text-8xl">
              <ReactTyped
                strings={[
                  "<span style='color: #9DBC98;'>Bratabandha</span>",
                  "<span style='color: #EBD9B4;'>Wedding</span>",
                  "<span style='color: #638889;'>Birthday</span>",
                  "<span style='color: #EBD9B4;'>Weaning</span>",
                ]}
                typeSpeed={100}
                loop
                backSpeed={20}
                cursorChar="|"
                showCursor={true}
              />
            </span>
          <div className="flex mt-5 md:mt-0 gap-2 md:gap-3">
            <button
              onClick={() => router.push("/events")}
              className="rounded-[26px] py-[8px] px-[16px] bg-landmark-dark text-white text-sm md:text-base"
            >
              Book an Event
            </button>
          </div>
        </div>
      </div>
      <div
        id="about-us-section"
        className="flex gap-2 md:gap-3 pb-5 md:pb-5 justify-center items-center w-full bg-gray-100 md:bg-[#F7FCFB]"
      >
        <Image src="/images/quotes.svg" alt="quotes" height={40} width={40} />
        <div className="flex h-[10vh] items-end">
          <span className="text-sm md:text-lg text-center">
            Your one-stop destination for fulfilling all your celebration requirements.
          </span>
        </div>
      </div>
    </div>
  );
};

export default IntroComponent;
