import React from "react";
const PostMeta = ({ date = "Mar 23", author = "Andiez Le", className1 = "", className2 = "" }) => {
    return (
        <div
            className={`flex items-center gap-x-3 text-sm text-[#6B6B6B] font-medium ${className1}`}
        >
            <span>{date}</span>
            <span className={`w-[6px] h-[6px] rounded-full bg-[#6B6B6B] ${className2}`}></span>
            <span>{author}</span>
        </div>
    );
};

export default PostMeta;
