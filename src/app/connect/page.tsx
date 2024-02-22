"use client";
import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { instance } from "../../../config/axios";

const MessageForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // Make multiple API calls in parallel
      const promises = [
        await instance.post(`/api/connect`, {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
        }),
        await fetch("/api/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }),
      ];

      const response = await Promise.all(promises);
      if (response) {
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phoneNumber: "",
          message: "",
        });
        toast.success("Your message has been uploaded successfully!", {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: true,
        });
      } else {
        throw new Error("Failed to submit message");
      }
    } catch (error) {
      console.error("Error submitting message:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">Submit a New Message</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="firstName" className="block mb-1">
            First Name:
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:bg-landmark-dark"
          />
        </div>
        <div>
          <label htmlFor="lastName" className="block mb-1">
            Last Name:
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:bg-landmark-dark"
          />
        </div>
        <div>
          <label htmlFor="email" className="block mb-1">
            Email:
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:bg-landmark-dark"
          />
        </div>
        <div>
          <label htmlFor="phoneNumber" className="block mb-1">
            Phone Number:
          </label>
          <input
            type="text"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:bg-landmark-dark"
          />
        </div>
        <div>
          <label htmlFor="message" className="block mb-1">
            Message:
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-landmark-dark"
          ></textarea>
        </div>
        <button
          type="submit"
          className="bg-landmark-dark text-white py-2 px-4 rounded-md hover:bg-landmark-dark focus:outline-none focus:bg-landmark-dark"
        >
          Submit
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default MessageForm;
