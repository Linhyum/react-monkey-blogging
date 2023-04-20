import React from "react";
import Button from "../button/Button";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../contexts/auth-context";

const Header = () => {
    const { userInfo } = useAuth();
    return (
        <div className="py-5 px-3">
            <header className="container justify-between flex items-center">
                <NavLink className="flex items-center gap-x-5" to={"/"}>
                    <img srcSet="logo.svg 3x" alt="monkey-blogging" />
                    <span className="font-semibold hidden sm:block">Monkey Blogging</span>
                </NavLink>
                {!userInfo ? (
                    <NavLink to={"/sign-in"}>
                        <Button width="160px" height="56px">
                            Sign In
                        </Button>
                    </NavLink>
                ) : (
                    <NavLink to={"/manage/post"}>
                        <Button width="150px" height="56px">
                            Dashboard
                        </Button>
                    </NavLink>
                )}
            </header>
        </div>
    );
};

export default Header;

/* <div className="capitalize text-primary font-medium">
    {
        (userInfo?.displayName).split(" ")[
            (userInfo?.displayName).split(" ").length - 1
        ]
    }
</div> */
