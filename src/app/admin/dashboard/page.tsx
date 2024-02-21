"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePathname, useSearchParams } from "next/navigation";

type Message = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  message: string;
};

const Dashboard = () => {
  const router = useRouter();
  console.log(router);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch("/api/messages");
        if (response.ok) {
          const data = await response.json();
          setMessages(data);
        } else {
          throw new Error("Failed to fetch messages");
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, []);

  const user =
    typeof window !== "undefined" ? window.localStorage.getItem("token") : null;

  if (!user) {
    router.push("/admin/login");
    return null; // Prevent rendering anything else if user is not logged in
  }

  return (
    <div className="flex flex-col gap-10">
      <h2>You have received the following messages:</h2>
      {messages.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Message</th>
            </tr>
          </thead>
          <tbody>
            {messages.map((message, index) => (
              <tr key={index}>
                <td>{message.firstName}</td>
                <td>{message.lastName}</td>
                <td>{message.email}</td>
                <td>{message.phoneNumber}</td>
                <td>{message.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No messages</p>
      )}
    </div>
  );
};

export default Dashboard;
