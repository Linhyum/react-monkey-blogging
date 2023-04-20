import React from "react";

const Label = ({ htmlFor = "", children, ...props }) => {
    return (
        <label htmlFor={htmlFor} {...props} className=" font-semibold cursor-pointer">
            {children}
        </label>
    );
};

export default Label;
