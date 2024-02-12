"use client";

import React, { ChangeEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { instance } from "../../../config/axios";
import axios from "axios";
import { CircularProgress, TextField } from "@mui/material";

interface CommunicationDetails {
    firstName: string,
    lastName: string;
    phoneNumber: string;
    message: string;
    email: string;
    emailError: string;
    firstNameError: string;
    lastNameError: string;
    phoneNumberError: string;
}

const ConnectPage = () => {
    const router = useRouter();
    const [communicationDetails, setCommunicationDetails] = useState<CommunicationDetails>({
        phoneNumberError: "",
        firstNameError: "",
        lastNameError: "",
        firstName: "",
        lastName: "",
        email: "",
        emailError: "",
        phoneNumber: "",
        message: ""
    });

    const [loading, setLoading] = useState(false);

    const postSubmit = async () => {
        try {
            setLoading(true);
            const res = await instance.post("/api/connect", {
                firstName: communicationDetails.firstName,
                lastName: communicationDetails.lastName,
                phoneNumber: communicationDetails.phoneNumber,
                message: communicationDetails.message,
                email: communicationDetails.email
            });
            if (res) {
                setLoading(false);
                setCommunicationDetails({
                    ...communicationDetails,
                    firstNameError: "",
                    lastNameError: "",
                    phoneNumberError: "",
                    emailError: "",
                });
                localStorage.setItem("token", res?.data);
                router.push("/home");
            }
        } catch (error) {
            setLoading(false);
            if (axios.isAxiosError(error)) {
                if (error?.response?.data) {
                    setCommunicationDetails({
                        ...communicationDetails,
                        firstNameError: error?.response?.data,
                        lastNameError: error?.response?.data,
                        phoneNumberError: error?.response?.data,
                    });
                }
            }
        }
    };

    const handleCredentialsChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setCommunicationDetails((prevDetails) => ({
            ...prevDetails,
            [name]: value,
            [`${name}Error`]: "",
        }));
    };

    const handleFormChange = () => {
        if (!communicationDetails.firstName) {
            setCommunicationDetails((prevDetails) => ({
                ...prevDetails,
                firstNameError: "Please enter your first name",
            }));
        } else if (!communicationDetails.lastName) {
            setCommunicationDetails((prevDetails) => ({
                ...prevDetails,
                passwordError: "Please enter last name",
            }));
        } else if (!communicationDetails.lastName) {
            setCommunicationDetails((prevDetails) => ({
                ...prevDetails,
                phoneNumberError: "Please enter your phone number",
            }));
        } else if (!communicationDetails.email) {
            setCommunicationDetails((prevDetails) => ({
                ...prevDetails,
                emailError: "Please enter your email as well.",
            }));
        }  else {
            postSubmit();
        }
    };

    const handleEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            handleFormChange();
        }
    };

    return (
        <div className="px-5 py-[100px] md:px-0 md:py-0">
            <span className="text-2xl md:text-3xl font-bold">
                {`We'd love to help you out`}
            </span>
            <div className="flex items-center justify-left mt-4 md:mt-8">
                <div className="flex flex-col gap-4 md:gap-6">
                    <span className="text-xl md:text-2xl font-semibold">
                        Please fill out this form
                    </span>
                    <div className="flex flex-col gap-4">
                        <TextField
                            size="small"
                            sx={{ width: "150%" }}
                            error={communicationDetails.firstName.length < 1}
                            helperText={communicationDetails.firstNameError}
                            onChange={handleCredentialsChange}
                            value={communicationDetails.firstName}
                            name="firstName"
                            placeholder="First Name"
                            onKeyDown={handleEnter}
                            InputProps={{
                                sx: {
                                    borderRadius: "34px",
                                    padding: "10px 15px",
                                    fontSize: "18px",
                                    backgroundColor: "#F2FFFB",
                                    border: "none",
                                },
                                disableUnderline: true,
                            }}
                        />
                        <TextField
                            size="small"
                            sx={{ width: "150%" }}
                            error={communicationDetails.lastName.length < 1}
                            helperText={communicationDetails.lastNameError}
                            onChange={handleCredentialsChange}
                            value={communicationDetails.lastName}
                            name="lastName"
                            placeholder="Last Name"
                            onKeyDown={handleEnter}
                            InputProps={{
                                sx: {
                                    borderRadius: "34px",
                                    padding: "10px 15px",
                                    fontSize: "18px",
                                    backgroundColor: "#F2FFFB",
                                    border: "none",
                                },
                                disableUnderline: true,
                            }}
                        />
                        <TextField
                            size="small"
                            sx={{ width: "150%" }}
                            error={communicationDetails.phoneNumber.length < 10}
                            helperText={communicationDetails.phoneNumberError}
                            onChange={handleCredentialsChange}
                            value={communicationDetails.phoneNumber}
                            name="phoneNumber"
                            placeholder="Phone Number"
                            onKeyDown={handleEnter}
                            InputProps={{
                                sx: {
                                    borderRadius: "34px",
                                    padding: "10px 15px",
                                    fontSize: "18px",
                                    backgroundColor: "#F2FFFB",
                                    border: "none",
                                },
                                disableUnderline: true,
                            }}
                        />
                        <TextField
                            size="small"
                            sx={{ width: "150%" }}
                            error={communicationDetails.email.length < 1}
                            helperText={communicationDetails.emailError}
                            onChange={handleCredentialsChange}
                            value={communicationDetails.email}
                            name="email"
                            placeholder="Your Email"
                            onKeyDown={handleEnter}
                            InputProps={{
                                sx: {
                                    borderRadius: "34px",
                                    padding: "10px 15px",
                                    fontSize: "18px",
                                    backgroundColor: "#F2FFFB",
                                    border: "none",
                                },
                                disableUnderline: true,
                            }}
                        />
                        <TextField
                            size="medium"
                            multiline
                            rows={4}
                            maxRows={7}
                            sx={{ width: "150%" }}
                            onChange={handleCredentialsChange}
                            value={communicationDetails.message}
                            name="message"
                            placeholder="Message"
                            onKeyDown={handleEnter}
                            InputProps={{
                                sx: {
                                    borderRadius: "34px",
                                    padding: "10px 15px",
                                    fontSize: "18px",
                                    backgroundColor: "#F2FFFB",
                                    border: "none",
                                },
                                disableUnderline: true,
                            }}
                        />
                        <button
                            onClick={handleFormChange}
                            className="rounded-full py-3 px-6 md:py-4 md:px-8 bg-landmark-light text-black text-lg md:text-xl hover:bg-yellow-400 focus:outline-none"
                        >
                            {loading ? <CircularProgress size={25} /> : "Submit"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConnectPage;
