"use client";

import React, { useRef } from "react";
import EventAccordion from "./GalleryAccordion";
import GalleryAccordion from "./GalleryAccordion";

const GalleryPage = () => {
    const playerRef = useRef(null);
    return (
        <div className="flex flex-col gap-10">
            <span className="text-3xl font-black text-center">Glimpses into the past</span>
            <GalleryAccordion />
        </div>
    );
};

export default GalleryPage;
