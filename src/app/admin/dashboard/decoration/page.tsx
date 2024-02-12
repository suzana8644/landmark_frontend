"use client"

import { useEffect, useState } from "react";
import { instance } from "../../../../../config/axios";
import { toast } from 'react-toastify';
import Link from "next/link";

type Decoration = {
    title: string
    description: string,
    themes: string[],
    categories: string[],
    availability: { from: Date, to: Date },
    price: number
}

export default function Decorator() {

    const [decoration, setDecoration] = useState<Decoration[]>([]);

    useEffect(() => {
        const fetchDecorations = async () => {
            try {
                const decorations = await instance.get("/api/decorations");
                setDecoration(decorations.data);
            } catch (error) {
                toast.error("Error fetching decorations");
            }
        }
        fetchDecorations();
    }, []);

    return (
        <>
            <div className="flex flex-col gap-10">
                <div>
                    <span className="text-3xl font-black text-left">Decoration List</span>
                </div>
                <div>
                    <Link href={'/admin/dashboard/decoration/add'}>
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                            Add Decoration
                        </button>
                    </Link>
                </div>
                <div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full border-collapse border border-gray-300">
                            <thead>
                                <tr>
                                    {/* Example column headers */}
                                    <th className="border border-gray-300 px-4 py-2">S.No</th>
                                    <th className="border border-gray-300 px-4 py-2">Title</th>
                                    <th className="border border-gray-300 px-4 py-2">Theme</th>
                                    <th className="border border-gray-300 px-4 py-2">Description</th>
                                    <th className="border border-gray-300 px-4 py-2">Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {decoration.map((item, index) => (
                                    <tr key={index}>
                                        {/* Example data cells */}
                                        <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                                        <td className="border border-gray-300 px-4 py-2">{item.title}</td>
                                        <td className="border border-gray-300 px-4 py-2">{item.themes}</td>
                                        <td className="border border-gray-300 px-4 py-2">{item.description}</td>
                                        <td className="border border-gray-300 px-4 py-2">{item.price}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </>
    )

}
