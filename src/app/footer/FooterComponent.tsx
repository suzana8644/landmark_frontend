import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  quickLinks,
  socialsLink,
} from "../../../raw-data/footer-quick-links";

const FooterComponent = () => {
  const router = useRouter();

  return (
    <div className="bg-landmark-dark md:px-[15em] md:py-[4em] static bottom-0 w-[100%]">
      <div className="flex flex-col P-[25px] md:flex-row justify-between gap-[20px] w-[100%] text-[16px] text-white">
        <div className="flex flex-col gap-[10px] w-[30%]">
          <Image
            src="/images/landmark_logo.png"
            alt="landmarklogo"
            height="150"
            width="250"
          />
          <div>
            <span>
              Landmark Decor
            </span>
          </div>
          <div>
            <span>Herald College, Naxal, Kathmandu, Nepal</span>
          </div>
          <div>
            <span>+977-1-424242</span>
          </div>
          <div>
            <span>landmarkdecor@herald.com.np</span>
          </div>
        </div>

        <div className={"flex flex-col justify-between"}>
          <div>
            <span className="font-bold">Quick Links</span>
            <div className="ml-[25px] mt-[10px] flex flex-col">
              {quickLinks?.map((data, index) => {
                return data.name === "FAQ's" ? (
                  <span
                    className="cursor-pointer"
                    onClick={() => router.push("/faqs")}
                    key={index}
                  >
                    {data.name}
                  </span>
                ) : (
                  <Link href={data.link} key={index}>
                    {data.name}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
        <div>
          <span className="font-bold">Socials</span>
          <div className="ml-[25px] mt-[10px] flex flex-col">
            {socialsLink?.map((data, index) => (
              <Link href={data.link} key={index}>
                {data.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-[1.5rem] text-[16px] text-white">
        <Link href="/#">Privacy Policy</Link>
        <Link href="/#">Terms & Services</Link>
      </div>
    </div>
  );
};

export default FooterComponent;
