'use client'

import { useEffect, useState } from "react";
import { instance } from "../../../../../../config/axios";
import { toast } from "react-toastify";
import { CircularProgress } from "@mui/material";

export default function AddDecoration() {

    const [loading, setLoading] = useState(false);
    const [decorators, setDecorators] = useState<{ name: string, id: string }[]>([]);
    const [formData, setFormData] = useState({
        decoratorId: '',
        title: '',
        description: '',
        themes: '',
        images: '',
        categories: 'Category 1',
        startDate: '',
        endDate: '',
        price: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [id]: value
        }));
    };

    useEffect(() => {
        // Simulated API call to fetch decorators
        // Replace this with your actual API call to fetch decorators
        const fetchDecorators = async () => {
            // Simulated data, replace with actual fetching logic
            const decorators = await instance.get("/api/decorators");
            const fetchedDecorators = decorators.data.map((d: any) => ({ name: d.userId.username, id: d.userId._id }));
            setDecorators(fetchedDecorators);
        };

        fetchDecorators();
    }, []);

    const handleSubmit = async () => {
        try {
            setLoading(true);
            const res = await instance.post("/decorations", {
                title: formData.title,
                description: formData.description,
                themes: formData.themes.split(','),
                images: formData.images.split(','),
                categories: formData.categories,
                availability: { from: new Date(formData.startDate), to: new Date(formData.endDate) },
                price: formData.price
            });

            if (res) {
                setLoading(false);
                setFormData({
                    decoratorId: '',
                    title: '',
                    description: '',
                    themes: '',
                    images: '',
                    categories: 'Category 1',
                    startDate: '',
                    endDate: '',
                    price: '',
                });
            }

            toast.success('decoration created!');

        } catch (error) {
            toast.error('error creating decoration.');

        }
    };

    return (
        <form className="w-full max-w-lg">
            <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full px-3">
                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="decoratorId">
                        Decorator ID
                    </label>
                    <select className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="decoratorId" onChange={handleChange}>
                        <option value="">Select Decorator</option>
                        {decorators.map(decorator => (
                            <option key={decorator.id} value={decorator.id}>{decorator.name}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full px-3">
                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="title">
                        Title
                    </label>
                    <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="title" type="text" placeholder="Enter Title" onChange={handleChange} />
                </div>
            </div>
            <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full px-3">
                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="description">
                        Description
                    </label>
                    <textarea className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="description" placeholder="Enter Description" onChange={handleChange}></textarea>
                </div>
            </div>
            <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full px-3">
                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="themes">
                        Themes
                    </label>
                    <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="themes" type="text" placeholder="Enter Themes (comma-separated)" onChange={handleChange} />
                </div>
            </div>
            <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full px-3">
                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="images">
                        Images
                    </label>
                    <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="images" type="text" placeholder="Enter Images (comma-separated)" onChange={handleChange} />
                </div>
            </div>
            <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full px-3">
                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="categories">
                        Categories
                    </label>
                    <select className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="categories" onChange={handleChange}>
                        <option>Category 1</option>
                        <option>Category 2</option>
                        <option>Category 3</option>
                    </select>
                </div>
            </div>
            <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="startDate">
                        Start Date
                    </label>
                    <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="startDate" type="date" onChange={handleChange} />
                </div>
                <div className="w-full md:w-1/2 px-3">
                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="endDate">
                        End Date
                    </label>
                    <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="endDate" type="date" onChange={handleChange} />
                </div>
            </div>
            <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="price">
                        Price
                    </label>
                    <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="price" type="number" placeholder="Enter Price" onChange={handleChange} />
                </div>
                <div className="w-full md:w-1/4 px-3">
                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="price">
                        <button
                            onClick={handleSubmit}
                            className="rounded-full py-3 px-6 md:py-4 md:px-8 bg-landmark-light text-black text-lg md:text-xl hover:bg-yellow-400 focus:outline-none"
                        >
                            {loading ? <CircularProgress size={25} /> : "Submit"}
                        </button>
                    </label>
                </div>
            </div>
        </form>
    );
}