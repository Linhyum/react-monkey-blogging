import React from "react";

const PostImage = ({
    url = "https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1120&q=80",
    height = "h-full",
    width = "w-full",
    alt = "",
}) => {
    return (
        <img
            className={`${width} flex-shrink-0 rounded-xl ${height} object-cover`}
            src={url}
            alt={alt}
            loading="lazy"
        />
    );
};

export default PostImage;
