import React from "react";
import { useDropdown } from "./dropdown-context";
import Select from "./Select";
import Content from "./Content";

const Dropdown = ({ placeholder = "Please select an option", children, ...props }) => {
   const { nodeRef } = useDropdown();

   return (
      <div ref={nodeRef} className="relative text-[#333] z-10 inline-block w-full">
         <Select placeholder={placeholder}></Select>
         <Content>{children}</Content>
      </div>
   );
};

export default Dropdown;
