import React from "react";
import { NavLink } from "react-router-dom";

const HomeBanner = () => {
    return (
        <div className="mt-3">
            <div className="container">
                <div className="banner rounded-lg px-10 py-[52px] flex flex-wrap-reverse md:flex-nowrap items-center gap-14">
                    <div className="w-full md:w-1/2">
                        <h1 className="font-bold text-5xl text-white mb-7">Monkey Blogging</h1>
                        <p className="font-normal text-white leading-7 text-justify mb-12 w-full">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                            tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                            veniam, quis nostrud exercitation ullamco laboris nisi.
                        </p>
                        <NavLink to={"/sign-in"}>
                            <button className="bg-white font-medium text-lg text-primary rounded-lg w-[150px] h-[58px]">
                                Get Started
                            </button>
                        </NavLink>
                    </div>
                    <img className="w-full md:w-1/2" src="bannerUser.svg" alt="banner" />
                </div>
            </div>
        </div>
    );
};

export default HomeBanner;
