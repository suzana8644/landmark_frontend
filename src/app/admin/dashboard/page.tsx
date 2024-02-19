"use client";

import React, { useRef } from "react";
import { useRouter } from 'next/navigation';

const Dashboard = () => {
    const router = useRouter();

    console.log(router);
    const playerRef = useRef(null);
    const user = typeof window !== 'undefined' ? window.localStorage.getItem('token') : null;

    if (!user) {
        router.push("/admin/login");
    }

    return (
        <div className="flex flex-col gap-10">
            Dashboard page
        </div>
    );
};

export default Dashboard;
