"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { CircularProgress, FilledInputClassKey } from "@mui/material";
import { instance } from "../../../../../../config/axios";

export default function AddDecoration() {
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<FileList>();
  const [formData, setFormData] = useState({
    eventCategoryId: "",
    name: "",
    description: "",
    imageId: "",
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //@ts-ignore
    setImages(e.target.files);
  };

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
  const saveImageUrlToDb = async (eventCategoryId: string, imageInfo: any) => {
    console.log("Image Info from saveImageUrltodb: ", imageInfo);
    await fetch("/api/fetchCategories?image=true", {
      method: "POST",
      body: JSON.stringify({
        eventCategoryId,
        data: imageInfo,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  };
  const uploadImages = async (images: FileList) => {
    try {
      const formData = new FormData();
      for (let i = 0; i < images.length; i++) {
        formData.append("file", images[i]);
      }
      const response = await instance.post("/api/upload", formData);
      return response.data.fileInfo;
    } catch (error) {
      toast.error("Error uploading images");
    }
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      setLoading(true);
      console.log("FormData", formData);
      const body = {
        name: formData.name,
        description: formData.description,
      };

      // Make multiple API calls in parallel

      const res = await fetch(`/api/fetchCategories`, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (res) {
        const eventCategory = await res.json();
        const uploadedImages = await uploadImages(images as FileList);
        await saveImageUrlToDb(eventCategory.eventCategoryId, uploadedImages);
        setLoading(false);
        setFormData({
          name: "",
          description: "",
          eventCategoryId: "",
          imageId: "",
        });
      }
      toast.success("Event Category created!");
    } catch (error) {
      toast.error("Error creating event category.");
    }
  };

  return (
    <>
      <h1 className="text-2xl font-semibold text-black">
        Add New Event category:
      </h1>
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
              htmlFor="images"
            >
              Cover Image
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="image"
              type="file"
              placeholder="Enter Images (comma-separated)"
              onChange={handleImageChange}
            />
          </div>
        </div>
        <button
          onClick={handleSubmit}
          className="rounded-full py-3 px-6 md:py-4 md:px-8 bg-landmark-light text-black text-lg md:text-xl hover:bg-yellow-400 focus:outline-none"
        >
          {loading ? <CircularProgress size={25} /> : "Submit"}
        </button>
      </form>
    </>
  );
}
