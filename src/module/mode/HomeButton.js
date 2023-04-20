import React from "react";

import { NavLink, Outlet } from "react-router-dom";
const HomeButton = () => {
    return (
        <div>
            <NavLink
                to={"/"}
                className="text-3xl z-50 flex items-center justify-center text-white bg-green-500 w-14 h-14 rounded-full cursor-pointer fixed bottom-5 right-5"
            >
                <i class="fa-solid fa-house"></i>
            </NavLink>
            <Outlet></Outlet>
        </div>
    );
};

export default HomeButton;
