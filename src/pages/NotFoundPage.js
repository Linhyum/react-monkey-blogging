import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import Button from "../components/button/Button";

const NotFoundPage = () => {
    useEffect(() => {
        document.title = "Not Found Page";
    }, []);
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <NavLink to={"/"} className="mb-5">
                <img srcSet="/logo.svg 2x" alt="monkey-blogging" />
            </NavLink>
            <h1 className="text-8xl font-bold text-primary mb-8">404</h1>
            <h2 className="text-2xl font-medium mb-4">Oops! Page not found</h2>
            <p className="mb-8">
                The page you are looking for might have been removed, had its name changed or is
                temporarily unavailable.
            </p>

            <NavLink to={"/"}>
                <Button width="190px" height="56px">
                    Go back to home
                </Button>
            </NavLink>
        </div>
    );
};

export default NotFoundPage;
