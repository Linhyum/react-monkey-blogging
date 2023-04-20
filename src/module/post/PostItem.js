import React from "react";
import PostMeta from "./PostMeta";
import PostTitle from "./PostTitle";
import PostCategory from "./PostCategory";
import PostImage from "./PostImage.js";
import { NavLink } from "react-router-dom";

const PostItem = ({ post }) => {
    return (
        <NavLink to={`/${post?.slug}`} className="bg-blue-100 p-3 rounded-lg">
            <PostImage url={post?.image} alt={post?.title} height="h-[202px]"></PostImage>
            <PostCategory mr={"mt-6"}>{post?.category?.name}</PostCategory>
            {/* <div className="flex flex-col justify-between"> */}
            <PostTitle cl="[#333]" margin="my-[10px]">
                {post?.title}
            </PostTitle>
            <PostMeta
                date={new Date(post?.createdAt?.seconds * 1000).toLocaleDateString("vi-VI")}
                author={post?.user?.fullname}
            ></PostMeta>
            {/* </div> */}
        </NavLink>
    );
};

export default PostItem;
