"use client";

import React, { useEffect, useState } from "react";
import { instance } from "../../../../../config/axios";
import { toast } from "react-toastify";

// Define the type for an organizer
type Organizer = {
  organizerId: number;
  name: string;
  phoneNumber: string;
  email: string;
  whatsappId: string;
};

export default function User() {
  // State to manage organizers data

  const [organizers, setOrganizers] = useState<Organizer[]>([]);
  const [label, setLabel] = useState<"Update" | "Add">("Add");
  const [toUpdate, setToUpdate] = useState<Organizer>();

  useEffect(() => {
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

  const updateOrganizer = async (body: any) => {
    const response = await fetch(`/api/fetchOrganizers`, {
      method: "PUT",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const updatedOrganizer = await response.json();
    console.log(updatedOrganizer);
    setOrganizers(
      organizers.map((organizer) =>
        organizer.organizerId === body.organizerId ? body : organizer,
      ),
    );
    toast.success("Organizer updated!");
    toggleForm();
  };
  // Function to handle adding a new organizer
  const addOrganizer = async (body: Omit<Organizer, "organizerId">) => {
    const response = await fetch("/api/fetchOrganizers", {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const newOrganizer = await response.json();
    setOrganizers([...organizers, newOrganizer]);
    toast.success("Organizer added!");
    toggleForm();
  };

  // Function to handle deleting an organizer
  const deleteOrganizer = async (id: number) => {
    const response = await fetch(`/api/fetchOrganizers?id=${id}`, {
      method: "DELETE",
    });

    if (response.status === 200) {
      toast.success("organizer deleted");
      const organizer = await response.json();
      setOrganizers(
        organizers.filter((organizer) => organizer.organizerId !== id),
      );
    } else {
      toast.error("Error deleting organizer");
    }
  };

  return (
    <div className="flex flex-col gap-10">
      <span className="text-3xl font-black text-center">Edit Organizers</span>

      {/* Table to display organizers */}
      <table className="table-auto border-collapse rounded border-landmark-dark border-2">
        <thead>
          <tr>
            <th className={"border border-landmark-dark py-1 px-2"}>Name</th>
            <th className={"border border-landmark-dark py-1 px-2"}>
              Phone Number
            </th>
            <th className={"border border-landmark-dark py-1 px-2"}>Email</th>
            <th className={"border border-landmark-dark py-1 px-2"}>Action</th>
          </tr>
        </thead>
        <tbody>
          {organizers.map((organizer) => (
            <tr key={organizer.organizerId}>
              <td className={"border border-landmark-dark py-1 px-2"}>
                {organizer.name}
              </td>
              <td className={"border border-landmark-dark py-1 px-2"}>
                {organizer.phoneNumber}
              </td>
              <td className={"border border-landmark-dark py-1 px-2"}>
                {organizer.email}
              </td>
              <td className="border border-gray-400 p-4">
                {/* Edit and Delete buttons for each organizer */}
                <button
                  className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-2 rounded mr-2"
                  onClick={() => toggleForm("Update", organizer)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-2 rounded"
                  onClick={() => deleteOrganizer(organizer.organizerId)}
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
          onClick={() => toggleForm("Add")}
        >
          Add Organizer
        </button>
      </div>

      {/* Form to add a new organizer */}
      {(showForm ||
        updateFormId) &&
        (label === "Add" ? (
          <Form updateOrAdd={addOrganizer} label={label} />
        ) : (
          <Form
            organizerBody={toUpdate}
            updateOrAdd={updateOrganizer}
            label={label}
          />
        ))}
    </div>
  );
}
const Form: React.FC<{
  organizerBody?: any;
  label: string;
  updateOrAdd: (body: any) => void;
}> = ({ organizerBody, label, updateOrAdd }) => {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [whatsappId, setWhatsAppId] = useState("");

  useEffect(() => {
    setName(organizerBody?.name || "");
    setPhoneNumber(organizerBody?.phoneNumber || "");
    setEmail(organizerBody?.email || "");
    setWhatsAppId(organizerBody?.whatsappId || "");
  }, [organizerBody]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation
    if (!name || !phoneNumber || !email) return;
    // Create new organizer object
    const newOrganizer = {
      organizerId: organizerBody?.organizerId || "",
      name,
      phoneNumber,
      email,
      whatsappId,
    } as Organizer;
    // Call addOrganizer function passed from parent component
    updateOrAdd(newOrganizer);
    // Reset form fields
    setName("");
    setPhoneNumber("");
    setEmail("");
    setWhatsAppId("");
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
      <input
        type="text"
        placeholder="Phone Number"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        className="border border-gray-400 p-2 rounded"
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border border-gray-400 p-2 rounded"
      />
      <input
        type="text"
        placeholder="WhatsApp Id"
        value={whatsappId}
        onChange={(e) => setWhatsAppId(e.target.value)}
        className="border border-gray-400 p-2 rounded"
      />
      <button
        type="submit"
        className="bg-landmark-dark hover:bg-landmark-dark text-white font-bold py-2 px-4 rounded"
      >
        {label} Organizer
      </button>
    </form>
  );
};

const UpdateForm: React.FC<{
  updateOrganizer: (updateBody: Organizer) => void;
  updateBody: any;
}> = ({ updateOrganizer, updateBody }) => {
  console.log("update", updateBody);
  const [name, setName] = useState(updateBody.name);
  const [phoneNumber, setPhoneNumber] = useState(updateBody.phoneNumber);
  const [email, setEmail] = useState(updateBody.email);
  const [whatsappId, setWhatsAppId] = useState(updateBody.whatsappId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation
    if (!name || !phoneNumber || !email) return;
    // Create new organizer object
    const newOrganizer = {
      organizerId: updateBody.organizerId,
      name,
      phoneNumber,
      email,
      whatsappId,
    } as Organizer;
    // Call addOrganizer function passed from parent component
    updateOrganizer(newOrganizer);
    // Reset form fields
    setName("");
    setPhoneNumber("");
    setEmail("");
    setWhatsAppId("");
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
      <input
        type="text"
        placeholder="Phone Number"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        className="border border-gray-400 p-2 rounded"
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border border-gray-400 p-2 rounded"
      />
      <input
        type="text"
        placeholder="WhatsApp Id"
        value={whatsappId}
        onChange={(e) => setWhatsAppId(e.target.value)}
        className="border border-gray-400 p-2 rounded"
      />
      <button
        type="submit"
        className="bg-landmark-dark hover:bg-landmark-dark text-white font-bold py-2 px-4 rounded"
      >
        Update Organizer
      </button>
    </form>
  );
};
// OrganizerForm component to handle adding new organizers
const OrganizerForm: React.FC<{
  addOrganizer: (newOrganizer: Organizer) => void;
}> = ({ addOrganizer }) => {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [whatsappId, setWhatsAppId] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation
    if (!name || !phoneNumber || !email) return;
    // Create new organizer object
    const newOrganizer = {
      name,
      phoneNumber,
      email,
      whatsappId,
    } as Organizer;
    // Call addOrganizer function passed from parent component
    addOrganizer(newOrganizer);
    // Reset form fields
    setName("");
    setPhoneNumber("");
    setEmail("");
    setWhatsAppId("");
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
      <input
        type="text"
        placeholder="Phone Number"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        className="border border-gray-400 p-2 rounded"
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border border-gray-400 p-2 rounded"
      />
      <input
        type="text"
        placeholder="WhatsApp Id"
        value={whatsappId}
        onChange={(e) => setWhatsAppId(e.target.value)}
        className="border border-gray-400 p-2 rounded"
      />
      <button
        type="submit"
        className="bg-landmark-dark hover:bg-landmark-dark text-white font-bold py-2 px-4 rounded"
      >
        Add Organizer
      </button>
    </form>
  );
};
