import React from "react";
import { Outlet } from "react-router-dom";
import useLocalStorage from "../../hooks/useLocalStorage";
import { useState } from "react";
import { AuthProvider } from "../../contexts/auth-context";

const DarkMode = () => {
    const { storedValue, setValue } = useLocalStorage("dark", false);
    const [dark, setDark] = useState(storedValue);
    if (dark) {
        document.body.classList.add("dark");
    } else {
        document.body.classList.remove("dark");
    }
    return (
        <AuthProvider>
            <div className="fixed z-50 bottom-8 left-5">
                <div
                    className={`relative transition-all duration-300 w-20 h-9 flex items-center cursor-pointer rounded-full ${
                        dark ? "bg-green-500" : "bg-slate-400"
                    } `}
                    onClick={() => {
                        setDark(!dark);
                        setValue(!dark);
                    }}
                >
                    <div
                        className={`absolute flex items-center justify-center transition-all duration-300 w-8 h-8 rounded-full  ${
                            dark ? "left-full -translate-x-full bg-white" : "left-0 bg-green-500"
                        }`}
                    >
                        <i
                            className={`${
                                dark
                                    ? "fa-solid fa-moon text-green-500"
                                    : "fa-solid fa-sun text-white"
                            }`}
                        ></i>
                    </div>
                </div>
            </div>
            <Outlet></Outlet>
        </AuthProvider>
    );
};

export default DarkMode;
