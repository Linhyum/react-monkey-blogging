import React from "react";
import { useController } from "react-hook-form";

const Radio = ({ checked, children, control, name, ...rest }) => {
    const { field } = useController({
        control,
        name,
        defaultValue: "",
    });
    return (
        <label>
            <input
                onChange={() => {}}
                checked={checked}
                type="radio"
                className="hidden-input"
                {...field}
                {...rest}
            />
            <div className="flex items-center gap-x-3 font-medium cursor-pointer">
                <div
                    className={`w-7 h-7 flex items-center ${
                        checked ? "border-[3px] border-primary" : "bg-white border border-gray-400"
                    } justify-center rounded-full`}
                >
                    {checked && <div className="w-4 h-4 rounded-full bg-primary"></div>}
                </div>
                <span>{children}</span>
            </div>
        </label>
    );
};

export default Radio;
