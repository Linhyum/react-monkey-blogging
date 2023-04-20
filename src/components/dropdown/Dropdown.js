import React from "react";
import { DropdownProvider } from "./dropdown-context";
import Select from "./Select";
import Content from "./Content";

const Dropdown = ({ placeholder = "Please select an option", children, ...props }) => {
    return (
        <DropdownProvider {...props}>
            <div className="relative inline-block w-full">
                <Select placeholder={placeholder}></Select>
                <Content>{children}</Content>
            </div>
        </DropdownProvider>
    );
};

export default Dropdown;
