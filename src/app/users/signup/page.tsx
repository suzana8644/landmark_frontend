"use client";

import React, { ChangeEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { TextField, CircularProgress } from "@mui/material";
import axios from "axios";

import { instance } from "../../../../config/axios";

interface UserDetails {
    username: string;
    usernameError: string;
    password: string;
    passwordError: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
}

const SignupPage = () => {
    const router = useRouter();
    const [credentials, setCredentials] = useState<UserDetails>({
        username: "",
        usernameError: "",
        password: "",
        passwordError: "",
        email: "",
        firstName: "",
        lastName: "",
        role: "admin",
    });

    const [loading, setLoading] = useState(false);

    const postLogin = async () => {
        try {
            setLoading(true);
            const res = await instance.post("/login", {
                username: credentials.username,
                password: credentials.password,
            });
            if (res) {
                setLoading(false);
                setCredentials({
                    ...credentials,
                    usernameError: "",
                    passwordError: "",
                });
                localStorage.setItem("token", res?.data);
                router.push("/");
            }
        } catch (error) {
            setLoading(false);
            if (axios.isAxiosError(error)) {
                if (error?.response?.data) {
                    setCredentials({
                        ...credentials,
                        usernameError: error?.response?.data,
                        passwordError: error?.response?.data,
                    });
                }
            }
        }
    };

    const handleCredentialsChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setCredentials((prevCredentials) => ({
            ...prevCredentials,
            [name]: value,
            [`${name}Error`]: "",
        }));
    };

    const handleLogin = () => {
        if (!credentials.username) {
            setCredentials((prevCredentials) => ({
                ...prevCredentials,
                usernameError: "Please enter your username",
            }));
        } else if (!credentials.password) {
            setCredentials((prevCredentials) => ({
                ...prevCredentials,
                passwordError: "Please enter password",
            }));
        } else {
            postLogin();
        }
    };

    const handleEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            handleLogin();
        }
    };

    return (
        <div className="px-5 py-[100px] md:px-0 md:py-0">
      <span className="text-2xl md:text-3xl font-bold">
        {`Let's get started`}
      </span>
            <div className="flex items-center justify-center mt-4 md:mt-8">
                <div className="flex flex-col gap-4 md:gap-6">
          <span className="text-xl md:text-2xl font-semibold">
            Login with your Email
          </span>
                    <div className="flex flex-col gap-4">
                        <TextField
                            size="small"
                            sx={{ width: "100%" }}
                            error={credentials.usernameError.length > 0}
                            helperText={credentials.usernameError}
                            onChange={handleCredentialsChange}
                            value={credentials.username}
                            name="username"
                            placeholder="Enter your email"
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
                            sx={{ width: "100%" }}
                            error={credentials.passwordError.length > 0}
                            helperText={credentials.passwordError}
                            onChange={handleCredentialsChange}
                            value={credentials.password}
                            name="password"
                            type="password"
                            placeholder="Password"
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
                            onClick={handleLogin}
                            className="rounded-full py-3 px-6 md:py-4 md:px-8 bg-landmark-light text-black text-lg md:text-xl hover:bg-yellow-400 focus:outline-none"
                        >
                            {loading ? <CircularProgress size={25} /> : "Login"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;
