import React from "react";

import { NavLink, Outlet } from "react-router-dom";
const HomeButton = () => {
    return (
        <>
            <NavLink
                to={"/"}
                className="fixed z-50 flex items-center justify-center text-3xl text-white bg-green-500 rounded-full cursor-pointer w-14 h-14 bottom-5 right-5"
            >
                <i className="fa-solid fa-house"></i>
            </NavLink>
            <Outlet></Outlet>
        </>
    );
};

export default HomeButton;
