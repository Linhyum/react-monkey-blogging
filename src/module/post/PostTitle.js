import React from "react";

const PostTitle = ({
    children = "Hướng dẫn setup phòng cực chill dành cho người mới toàn tập",
    big = false,
    cl = "[#232323]",
    margin,
}) => {
    return (
        <h3 className={`${big ? "text-[22px]" : "text-lg"} text-${cl} font-semibold ${margin}`}>
            {children}
        </h3>
    );
};

export default PostTitle;
