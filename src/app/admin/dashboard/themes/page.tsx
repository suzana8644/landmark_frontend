"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  EventCategory,
  Image,
  Organizer,
} from "../../../../../utils/interfaces";
import { useRouter } from "next/navigation";

type Theme = {
  themeId: number;
  name: string;
  image: Image[];
  description: string;
  price: number;
  additionalDetails: string;
  organizer: Organizer;
  organizerId: string;
  eventCategory: EventCategory;
  eventCategoryId: string;
};

export default function User() {
  const router = useRouter();
  // State to manage themes data

  const [themes, setThemes] = useState<Theme[]>([]);
  const [label, setLabel] = useState<"Update" | "Add">("Add");
  const [toUpdate, setToUpdate] = useState<Theme>();

  useEffect(() => {
    const fetchTheme = async () => {
      try {
        const response = await fetch("/api/fetchThemes");
        const organizers = await response.json();
        console.log(organizers);
        setThemes(organizers);
      } catch (error) {
        toast.error("Error fetching themes");
      }
    };
    fetchTheme();
  }, []);

  // State to manage form visibility
  const [showForm, setShowForm] = useState(false);
  const [updateFormId, setUpdateFormId] = useState("");

  // Function to toggle form visibility
  const toggleForm = (label?: "Add" | "Update", body?: any) => {
    if (label === "Update" && showForm) {
      setToUpdate(body);
      setUpdateFormId(body.organizerId);
      return setLabel(label);
    }
    setShowForm(!showForm);
    setLabel("Add");
  };

  const updateThemes = async (body: any) => {
    console.log("Update body: ", body);
    const response = await fetch(`/api/fetchThemes`, {
      method: "PUT",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const updatedTheme = await response.json();
    console.log(updatedTheme);
    setThemes(
      themes.map((theme) => (theme.themeId === body.themeId ? body : theme)),
    );
    toast.success("Theme updated!");
    toggleForm();
  };
  // Function to handle adding a new organizer
  const addTheme = async (body: Omit<Theme, "themeId">) => {
    const response = await fetch("/api/fetchThemes", {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const newTheme = await response.json();
    setThemes([...themes, newTheme]);
    toast.success("Organizer added!");
    toggleForm();
  };

  // Function to handle deleting an organizer
  const deleteTheme = async (id: number) => {
    const response = await fetch(`/api/fetchThemes?id=${id}`, {
      method: "DELETE",
    });

    if (response.status === 200) {
      toast.success("Theme deleted");
      const theme = await response.json();
      setThemes(themes.filter((theme) => theme.themeId !== id));
    } else {
      toast.error("Error deleting Theme");
    }
  };

  return (
    <div className="flex flex-col gap-10">
      <span className="text-3xl font-black text-center">Edit Themes</span>

      {/* Table to display themes */}
      <table className="table-auto border-collapse rounded border-landmark-dark border-2">
        <thead>
          <tr>
            <th className={"border border-landmark-dark py-1 px-2"}>Name</th>
            <th className={"border border-landmark-dark py-1 px-2"}>
              Description
            </th>
            <th className={"border border-landmark-dark py-1 px-2"}>Price</th>
            <th className={"border border-landmark-dark py-1 px-2"}>Action</th>
          </tr>
        </thead>
        <tbody>
          {themes.map((theme) => (
            <tr key={theme.themeId}>
              <td className={"border border-landmark-dark py-1 px-2"}>
                {theme.name}
              </td>
              <td className={"border border-landmark-dark py-1 px-2"}>
                {theme.description}
              </td>
              <td className={"border border-landmark-dark py-1 px-2"}>
                {theme.price}
              </td>
              <td className="border border-gray-400 p-4">
                {/* Edit and Delete buttons for each organizer */}
                <button
                  className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-2 rounded mr-2"
                  onClick={() => toggleForm("Update", theme)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-2 rounded"
                  onClick={() => deleteTheme(theme.themeId)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className={"flex flex-row-reverse"}>
        {/* Button to toggle the form */}
        <button
          className="bg-landmark-dark hover:bg-landmark-dark text-white font-bold py-2 px-4 rounded"
          onClick={() => router.push("/admin/dashboard/themes/add")}
        >
          Add Theme
        </button>
      </div>

      {/* Form to add a new organizer */}
      {showForm &&
        updateFormId &&
        (label === "Add" ? (
          <Form updateOrAdd={addTheme} label={label} />
        ) : (
          <Form themeBody={toUpdate} updateOrAdd={updateThemes} label={label} />
        ))}
    </div>
  );
}

const Form: React.FC<{
  themeBody?: any;
  label: string;
  updateOrAdd: (body: any) => void;
}> = ({ themeBody, label, updateOrAdd }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  //const [whatsappId, setWhatsAppId] = useState("");

  useEffect(() => {
    setName(themeBody?.name || "");
    setDescription(themeBody?.description || "");
    setPrice(themeBody?.price || "");
    //setWhatsAppId(themeBody?.whatsappId || "");
  }, [themeBody]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation
    if (!name || !description || !price) return;
    // Create new organizer object
    const newTheme = {
      themeId: themeBody?.themeId || "",
      name,
      description,
      price: Number(price),
    } as Theme;
    // Call addOrganizer function passed from parent component
    updateOrAdd(newTheme);
    // Reset form fields
    setName("");
    setDescription("");
    setPrice("");
    //setWhatsAppId("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border border-gray-400 p-2 rounded"
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border border-gray-400 p-2 rounded"
        style={{ width: "100%", height: "250px" }}
      />

      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        className="border border-gray-400 p-2 rounded resize"
      />
      <button
        type="submit"
        className="bg-landmark-dark hover:bg-landmark-dark text-white font-bold py-2 px-4 rounded"
      >
        {label} Theme
      </button>
    </form>
  );
};

const UpdateForm: React.FC<{
  updateTheme: (updateBody: Theme) => void;
  updateBody: any;
}> = ({ updateTheme, updateBody }) => {
  console.log("update", updateBody);
  const [name, setName] = useState(updateBody.name);
  const [description, setDescription] = useState(updateBody.description);
  const [price, setPrice] = useState(updateBody.price);
  // const [whatsappId, setWhatsAppId] = useState(updateBody.whatsappId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation
    if (!name || !description || !price) return;
    // Create new organizer object
    const newTheme = {
      themeId: updateBody.themeId,
      name,
      description,
      price,
    } as Theme;
    // Call addOrganizer function passed from parent component
    updateTheme(newTheme);
    // Reset form fields
    setName("");
    setDescription("");
    setPrice("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border border-gray-400 p-2 rounded"
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border border-gray-400 p-2 rounded"
        style={{ width: "100%", height: "250px" }}
      />
      <input
        type="text"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        className="border border-gray-400 p-2 rounded"
      />
      <button
        type="submit"
        className="bg-landmark-dark hover:bg-landmark-dark text-white font-bold py-2 px-4 rounded"
      >
        Update Theme
      </button>
    </form>
  );
};
