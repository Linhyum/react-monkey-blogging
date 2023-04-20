import React from "react";

const PostCategory = ({ children = "Kiến thức", className, bg = "[#F3EDFF]", mr }) => {
    return (
        <span
            className={`text-sm py-2 px-4 font-semibold rounded-lg inline-block text-[#6B6B6B] bg-${bg} ${mr} ${className}`}
        >
            {children}
        </span>
    );
};

export default PostCategory;
