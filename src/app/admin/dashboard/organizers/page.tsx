"use client";

import { useState } from "react";

// Define the type for an organizer
type Organizer = {
  id: number;
  name: string;
  phoneNumber: string;
  email: string;
};

export default function User() {
  // State to manage organizers data
  const [organizers, setOrganizers] = useState<Organizer[]>([
    {
      id: 1,
      name: "John Doe",
      phoneNumber: "123-456-7890",
      email: "john@example.com",
    },
    {
      id: 2,
      name: "Jane Smith",
      phoneNumber: "987-654-3210",
      email: "jane@example.com",
    },
    // Add more organizers as needed
  ]);

  // State to manage form visibility
  const [showForm, setShowForm] = useState(false);

  // Function to toggle form visibility
  const toggleForm = () => {
    setShowForm(!showForm);
  };

  // Function to handle adding a new organizer
  const addOrganizer = (newOrganizer: Organizer) => {
    setOrganizers([...organizers, newOrganizer]);
    toggleForm();
  };

  // Function to handle deleting an organizer
  const deleteOrganizer = (id: number) => {
    setOrganizers(organizers.filter((organizer) => organizer.id !== id));
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
            <tr key={organizer.id}>
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
                <button className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-2 rounded mr-2">
                  Edit
                </button>
                <button
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-2 rounded"
                  onClick={() => deleteOrganizer(organizer.id)}
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
          onClick={toggleForm}
        >
          Add Organizer
        </button>
      </div>

      {/* Form to add a new organizer */}
      {showForm && <OrganizerForm addOrganizer={addOrganizer} />}
    </div>
  );
}

// OrganizerForm component to handle adding new organizers
const OrganizerForm: React.FC<{
  addOrganizer: (newOrganizer: Organizer) => void;
}> = ({ addOrganizer }) => {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation
    if (!name || !phoneNumber || !email) return;
    // Create new organizer object
    const newOrganizer: Organizer = {
      id: Math.random(), // Just for demonstration, ideally use a proper unique id generator
      name,
      phoneNumber,
      email,
    };
    // Call addOrganizer function passed from parent component
    addOrganizer(newOrganizer);
    // Reset form fields
    setName("");
    setPhoneNumber("");
    setEmail("");
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
      <button
        type="submit"
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
      >
        Add Organizer
      </button>
    </form>
  );
};
