"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Theme } from "../../../../../utils/interfaces";
import { useRouter } from "next/navigation";

type EventCategory = {
  eventCategoryId: number;
  name: String;
  description: String;
  image: String;
  themes: Theme[];
};

export default function User() {
  const router = useRouter();
  // State to manage themes data

  const [eventCategories, setEventCategories] = useState<EventCategory[]>([]);
  const [label, setLabel] = useState<"Update" | "Add">("Add");
  const [toUpdate, setToUpdate] = useState<EventCategory>();

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
    fetchEventCategories();
  }, []);

  // State to manage form visibility
  const [showForm, setShowForm] = useState(false);
  const [updateFormId, setUpdateFormId] = useState("");

  // Function to toggle form visibility
  const toggleForm = (label?: "Add" | "Update", body?: any) => {
    if (label === "Update" && showForm) {
      setToUpdate(body);
      setUpdateFormId(body.eventCategoryId);
      return setLabel(label);
    }
    setShowForm(!showForm);
    setLabel("Add");
  };

  const updateCategories = async (body: any) => {
    console.log("Update body: ", body);
    const response = await fetch(`/api/fetchCategories`, {
      method: "PUT",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const updatedCategory = await response.json();
    console.log(updatedCategory);
    setEventCategories(
      eventCategories.map((category) =>
        category.eventCategoryId === body.eventCategoryId ? body : category,
      ),
    );
    toast.success("Event Category updated!");
    toggleForm();
  };
  // Function to handle adding a new organizer
  const addCategory = async (body: Omit<EventCategory, "eventCategoryId">) => {
    const response = await fetch("/api/fetchCategories", {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const newCategory = await response.json();
    setEventCategories([...eventCategories, newCategory]);
    toast.success("Category added!");
    toggleForm();
  };

  // Function to handle deleting an organizer
  const deleteCategory = async (id: number) => {
    const response = await fetch(`/api/fetchCategories?id=${id}`, {
      method: "DELETE",
    });

    if (response.status === 200) {
      toast.success("Category deleted");
      const eventCategory = await response.json();
      setEventCategories(
        eventCategories.filter((category) => category.eventCategoryId !== id),
      );
    } else {
      toast.error("Error deleting event category");
    }
  };

  return (
    <div className="flex flex-col gap-10">
      <span className="text-3xl font-black text-center">Edit Categories</span>

      {/* Table to display themes */}
      <table className="table-auto border-collapse rounded border-landmark-dark border-2">
        <thead>
          <tr>
            <th className={"border border-landmark-dark py-1 px-2"}>Name</th>
            <th className={"border border-landmark-dark py-1 px-2"}>
              Description
            </th>
            <th className={"border border-landmark-dark py-1 px-2"}>Action</th>
          </tr>
        </thead>
        <tbody>
          {eventCategories.map((eventCategory) => (
            <tr key={eventCategory.eventCategoryId}>
              <td className={"border border-landmark-dark py-1 px-2"}>
                {eventCategory.name}
              </td>
              <td className={"border border-landmark-dark py-1 px-2"}>
                {eventCategory.description}
              </td>
              <td className="border border-gray-400 p-4">
                {/* Edit and Delete buttons for each organizer */}
                <button
                  className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-2 rounded mr-2"
                  onClick={() => toggleForm("Update", eventCategory)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-2 rounded"
                  onClick={() => deleteCategory(eventCategory.eventCategoryId)}
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
          onClick={() => router.push("/admin/dashboard/eventCategories/add")}
        >
          Add Category
        </button>
      </div>

      {/* Form to add a new organizer */}
      {showForm &&
        updateFormId &&
        (label === "Add" ? (
          <Form updateOrAdd={addCategory} label={label} />
        ) : (
          <Form
            eventCategoryBody={toUpdate}
            updateOrAdd={updateCategories}
            label={label}
          />
        ))}
    </div>
  );
}

const Form: React.FC<{
  eventCategoryBody?: any;
  label: string;
  updateOrAdd: (body: any) => void;
}> = ({ eventCategoryBody, label, updateOrAdd }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    setName(eventCategoryBody?.name || "");
    setDescription(eventCategoryBody?.description || "");
  }, [eventCategoryBody]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation
    if (!name || !description) return;
    // Create new Category object
    const newEventCategory = {
      eventCategoryId: eventCategoryBody?.eventCategoryId || "",
      name,
      description,
    } as unknown as EventCategory;
    // Call addOrganizer function passed from parent component
    updateOrAdd(newEventCategory);
    // Reset form fields
    setName("");
    setDescription("");
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

      {/*      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        className="border border-gray-400 p-2 rounded resize"
      />*/}
      {/*<input*/}
      {/*  type="text"*/}
      {/*  placeholder="WhatsApp Id"*/}
      {/*  value={whatsappId}*/}
      {/*  onChange={(e) => setWhatsAppId(e.target.value)}*/}
      {/*  className="border border-gray-400 p-2 rounded"*/}
      {/*/>*/}
      <button
        type="submit"
        className="bg-landmark-dark hover:bg-landmark-dark text-white font-bold py-2 px-4 rounded"
      >
        {label} Category
      </button>
    </form>
  );
};

const UpdateForm: React.FC<{
  updateEventCategory: (updateBody: EventCategory) => void;
  updateBody: any;
}> = ({ updateEventCategory, updateBody }) => {
  console.log("update", updateBody);
  const [name, setName] = useState(updateBody.name);
  const [description, setDescription] = useState(updateBody.description);
  //const [price, setPrice] = useState(updateBody.price);
  // const [whatsappId, setWhatsAppId] = useState(updateBody.whatsappId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation
    if (!name || !description) return;
    // Create new organizer object
    const newEventCategory = {
      eventCategoryId: updateBody.eventCategoryId,
      name,
      description,
    } as EventCategory;
    // Call addOrganizer function passed from parent component
    updateEventCategory(newEventCategory);
    // Reset form fields
    setName("");
    setDescription("");
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
      <button
        type="submit"
        className="bg-landmark-dark hover:bg-landmark-dark text-white font-bold py-2 px-4 rounded"
      >
        Update Category
      </button>
    </form>
  );
};
