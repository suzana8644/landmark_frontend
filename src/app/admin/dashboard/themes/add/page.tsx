"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { CircularProgress, FilledInputClassKey } from "@mui/material";
import { Theme } from "../../../../../../utils/interfaces";
import { instance } from "../../../../../../config/axios";

type Organizer = {
  organizerId: number;
  name: string;
  phoneNumber: string;
  email: string;
  whatsappId: string;
};

type EventCategory = {
  eventCategoryId: number;
  name: String;
  description: String;
  image: String[];
  themes: Theme[];
};

export default function AddDecoration() {
  const [loading, setLoading] = useState(false);
  const [organizers, setOrganizers] = useState<Organizer[]>([]);
  const [eventCategories, setEventCategories] = useState<EventCategory[]>([]);
  const [images, setImages] = useState<FileList>();
  const [formData, setFormData] = useState({
    organizerId: "",
    name: "",
    description: "",
    eventCategoryId: "",
    price: "",
  });
  const [uploadTheme, setUploadTheme] = useState<Theme>();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { id, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleIMageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //@ts-ignore
    setImages(e.target.files);
  }

  useEffect(() => {
    const fetchEventCategories = async () => {
      try {
        const response = await fetch("/api/fetchCategories");
        const eventCategories = await response.json();
        console.log(eventCategories);
        setEventCategories(eventCategories);
      } catch (error) {
        toast.error("Error fetching event categories");
      }
    };
    const fetchOrganizer = async () => {
      try {
        const response = await fetch("/api/fetchOrganizers");
        const organizers = await response.json();
        console.log(organizers);
        setOrganizers(organizers);
      } catch (error) {
        toast.error("Error fetching organizers");
      }
    };
    fetchOrganizer();
    fetchEventCategories();
  }, []);

  //useEffect ya kei use garna baki for better state management
  const saveImageUrlToDb = async (themeId: string, imageInfo: any) => {
        await fetch('/api/fetchThemes?image=true', {
          method: "POST",
          body: JSON.stringify({
            themeId,
            data: imageInfo
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });

  }
  const uploadImages = async (images: FileList) => {
    try {
      const formData = new FormData();
      for (let i = 0; i < images.length; i++) {
        formData.append("file", images[i]);
      }
      const response = await instance.post('/api/upload', formData);
      return response.data.fileInfo;

    } catch (error) {
      toast.error("Error uploading images");
    }
  }

  const handleSubmit = async () => {
    try {
      setLoading(true);
      console.log("FormData", formData);
      const body = {
        organizerId: formData.organizerId,
        eventCategoryId: formData.eventCategoryId,
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        additionalDetails: "",
      };
      // Make multiple API calls in parallel
      const promises = [
        await fetch(`/api/fetchThemes`, {
          method: "POST",
          body: JSON.stringify(body),
          headers: {
            "Content-Type": "application/json",
          },
        }),
      ];

      const res = await Promise.all(promises);

      if (res) {
        const theme = await res[0].json();
        const uploadedImages = await uploadImages(images as FileList);
        await saveImageUrlToDb(theme.themeId, uploadedImages);
        setLoading(false);
        setFormData({
          organizerId: "",
          name: "",
          description: "",
          eventCategoryId: "",
          price: "",
        });
      }
      toast.success("Theme created!");
    } catch (error) {
      toast.error("Error creating Theme.");
    }
  };

  return (
    <>
      <h1 className="text-2xl font-semibold text-black">Add Theme:</h1>
      <form className="w-full max-w-lg mt-4">
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full px-3">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="name"
            >
              Title
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="name"
              type="text"
              placeholder="Enter Title"
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full px-3">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="description"
            >
              Description
            </label>
            <textarea
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="description"
              placeholder="Enter Description"
              onChange={handleChange}
            ></textarea>
          </div>
        </div>
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full px-3">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="organizerId"
            >
              Organizer
            </label>
            <select
              className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="organizerId"
              onChange={handleChange}
            >
              <option value="">Select Organizer</option>
              {organizers?.map((organizer) => (
                <option
                  key={organizer.organizerId}
                  value={organizer.organizerId}
                >
                  {organizer.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full px-3">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="category"
            >
              Category
            </label>
            <select
              className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="eventCategoryId"
              onChange={handleChange}
            >
              <option value="">Select Event Category</option>
              {eventCategories.map((eventCategory) => (
                <option
                  key={eventCategory.eventCategoryId}
                  value={eventCategory.eventCategoryId}
                >
                  {eventCategory.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full px-3">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="images"
            >
              Images
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="images"
              type="file"
              placeholder="Enter Images (comma-separated)"
              onChange={handleIMageChange}
              multiple
            />
          </div>
        </div>
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="price"
            >
              Price
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="price"
              type="number"
              placeholder="Enter Price"
              onChange={handleChange}
            />
          </div>
          <div className="w-full md:w-1/4 px-3">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="price"
            >
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
    </>
  );
}
