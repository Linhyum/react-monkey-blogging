import React from "react";

import { NavLink } from "react-router-dom";
import { useAuth } from "../../contexts/auth-context";
import { useEffect } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../firebase/firebase-config";
import { useState } from "react";
import Sidebar from "./Sidebar";
import useClickOutSide from "../../hooks/useClickOutSide";

const DashboardHeader = () => {
    const { userInfo } = useAuth();
    const [user, setUser] = useState([]);
    const { show, setShow, nodeRef, handleClick } = useClickOutSide();
    //lấy ra user hiện tại
    useEffect(() => {
        async function fetchData() {
            const colRef = collection(db, "users");
            const newRef = query(colRef, where("fullname", "==", userInfo?.fullname));
            onSnapshot(newRef, (snapshot) => {
                const results = [];
                snapshot.forEach((doc) => {
                    results.push({
                        id: doc.id,
                        ...doc.data(),
                    });
                });
                setUser(results);
            });
        }
        fetchData();
    }, [userInfo?.fullname]);
    if (user.length <= 0) return null;
    return (
        <div className="bg-white p-5 border-b border-gray-200 flex justify-between items-center gap-5">
            <NavLink to={"/"} className="hidden xl:flex items-center font-semibold gap-x-5">
                <img srcSet="/logo.svg 3x" alt="monkey-blogging" />
                <span>Monkey Blogging</span>
            </NavLink>
            <div onClick={handleClick} className="xl:hidden text-4xl cursor-pointer text-green-500">
                <i class="fa-solid fa-bars"></i>
            </div>
            <strong className="ml-auto hidden sm:block">{userInfo?.username}</strong>
            <NavLink
                title={userInfo?.username}
                to={`/profile?id=${user[0]?.id}`}
                className="w-[52px] h-[52px]"
            >
                <img
                    src={userInfo?.avatar}
                    alt=""
                    className="w-full h-full object-cover rounded-full"
                />
            </NavLink>

            <div
                className={`overlay ${
                    show ? "visible opacity-100" : "invisible opacity-0"
                } transition-all duration-300 fixed inset-0 z-10 bg-black bg-opacity-30`}
            ></div>

            <div
                ref={nodeRef}
                className={`dashboardMenu ${
                    show ? "translate-x-0" : "-translate-x-full"
                } transition-all duration-300 shadow-xl bg-white fixed z-20 top-0 left-0 bottom-0`}
            >
                <div className="flex p-5 items-center font-semibold gap-x-6">
                    <NavLink to={"/"} className={"flex items-center gap-x-3"}>
                        <img srcSet="/logo.svg 3x" alt="monkey-blogging" />
                        <span>Monkey Blogging</span>
                    </NavLink>
                    <div
                        onClick={() => setShow(false)}
                        className="text-2xl text-green-500 cursor-pointer"
                    >
                        <i class="fa-solid fa-xmark"></i>
                    </div>
                </div>
                <div className="h-[1px] bg-gray-200 w-[90%] mx-auto"></div>
                <Sidebar
                    show={show}
                    setShow={setShow}
                    className={"!block h-full !shadow-none"}
                ></Sidebar>
            </div>
        </div>
    );
};

export default DashboardHeader;
