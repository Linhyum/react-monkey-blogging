import React from "react";
import PostMeta from "./PostMeta";
import PostTitle from "./PostTitle";
import PostCategory from "./PostCategory";
import PostImage from "./PostImage.js";
import { NavLink } from "react-router-dom";

const PostNewestLarge = ({ post }) => {
    if (!post?.id) return null;
    return (
        <NavLink to={`/${post?.slug}`}>
            <PostImage url={post?.image} alt={post?.title} height="h-[435px]"></PostImage>
            <PostCategory mr={"mt-6"}>{post?.category?.name}</PostCategory>
            <PostTitle big={true} margin="my-[10px]">
                {post?.title}
            </PostTitle>
            <PostMeta
                date={new Date(post?.createdAt?.seconds * 1000).toLocaleDateString("vi-VI")}
                author={post?.user?.fullname}
            ></PostMeta>
        </NavLink>
    );
};

export default PostNewestLarge;
