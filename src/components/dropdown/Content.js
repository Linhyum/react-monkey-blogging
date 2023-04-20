import React from "react";
import { useDropdown } from "./dropdown-context";

const Content = ({ children }) => {
    const { show } = useDropdown();
    return (
        <>
            {show && (
                <div className="absolute top-full left-0 w-full bg-white shadow-md max-h-[235px] overflow-y-auto">
                    {children}
                </div>
            )}
        </>
    );
};

export default Content;
