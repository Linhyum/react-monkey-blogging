import React, { useState } from "react";
import { useController } from "react-hook-form";
import IconEyeOpen from "../icon/IconEyeOpen";

const Input = ({ name = "", type = "text", hasIcon = false, control, className, ...props }) => {
    const { field } = useController({
        control,
        name,
        defaultValue: "",
    });
    const [open, setOpen] = useState(true);
    return (
        <div className="relative w-full">
            <input
                type={open ? type : "text"}
                autoComplete="off"
                id={name}
                {...field}
                {...props}
                className={`w-full ${
                    hasIcon ? "py-4 pl-4 pr-14" : "p-4"
                } rounded-lg text-[#333] font-medium transition-all border border-gray-300 focus:border-primary placeholder:text-[#84878b] ${className}`}
            />
            {hasIcon ? (
                <IconEyeOpen open={open} onClick={() => setOpen((open) => !open)}></IconEyeOpen>
            ) : null}
        </div>
    );
};

export default Input;
